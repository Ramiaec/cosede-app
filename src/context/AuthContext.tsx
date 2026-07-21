"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Cooperativa } from "../data/cooperativas";

interface AuthContextType {
  user: any | null;
  login: (usuario: string, clave: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
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

  const login = async (usuario: string, clave: string): Promise<boolean> => {
    try {
      const { verifyLogin } = await import("../app/actions/db-actions");
      const found = await verifyLogin(usuario, clave);
      
      if (found) {
        setUser(found);
        localStorage.setItem("cosede_session", JSON.stringify(found));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
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
