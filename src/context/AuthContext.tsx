"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Cooperativa } from "../data/cooperativas";

interface AuthContextType {
  user: Cooperativa | null;
  login: (usuario: string, clave: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Cooperativa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safely retrieve user from localStorage on client side
    const savedUser = localStorage.getItem("cosede_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("cosede_session");
      }
    }
    setLoading(false);
  }, []);

  const login = (usuario: string, clave: string): boolean => {
    // Import dynamically to avoid SSR/compilation order issues if any
    const { COOPERATIVAS_MAESTRA } = require("../data/cooperativas");
    const found = COOPERATIVAS_MAESTRA.find(
      (coop: Cooperativa) => coop.usuario === usuario && coop.clave === clave
    );

    if (found) {
      setUser(found);
      localStorage.setItem("cosede_session", JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cosede_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
