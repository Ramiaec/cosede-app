"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { COOPERATIVAS_MAESTRA } from "../data/cooperativas";

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [showTester, setShowTester] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(usuario, clave);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Usuario o clave incorrectos. Verifique sus credenciales.");
    }
  };

  const handleFill = (userVal: string, passVal: string) => {
    setUsuario(userVal);
    setClave(passVal);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden px-6">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md mx-auto space-y-8 z-10">
        {/* Brand Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex bg-gradient-to-tr from-blue-600 to-emerald-500 p-3 rounded-2xl shadow-xl shadow-blue-500/20 text-white font-black text-2xl tracking-wider">
            COSEDE
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Acceso Institucional</h2>
            <p className="text-slate-400 text-sm mt-1">Plataforma de Liquidación de Cooperativas - COSEDE-1000</p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Input Usuario */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">RUC / Usuario</label>
              <div className="relative">
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingrese el RUC de la cooperativa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pl-4 text-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {/* Input Clave */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Ingrese su clave"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 pl-4 text-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-98 text-sm"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Quick-fill developer tools for testing */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setShowTester(!showTester)}
              className="text-xs text-blue-500 hover:text-blue-400 font-semibold focus:outline-none"
            >
              {showTester ? "Ocultar usuarios de prueba" : "Ver usuarios de prueba (METADATAUSER.xlsx)"}
            </button>

            {showTester && (
              <div className="mt-3 bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-2 max-h-48 overflow-y-auto">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Haga clic en un usuario para autocompletar:</p>
                {COOPERATIVAS_MAESTRA.map((coop) => (
                  <button
                    key={coop.ruc}
                    onClick={() => handleFill(coop.usuario, coop.clave)}
                    className="w-full text-left p-2 rounded-lg text-slate-300 hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800 text-[11px] block"
                  >
                    <span className="font-bold text-slate-200 block truncate">{coop.razonSocial}</span>
                    <span className="text-slate-500 font-mono">Usuario: {coop.usuario} | Clave: {coop.clave}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600">
          Superintendencia de Economía Popular y Solidaria &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
