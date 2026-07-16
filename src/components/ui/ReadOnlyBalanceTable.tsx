"use client";

import { useState } from "react";

export interface BalanceItem {
  id: number;
  nivel: number;
  codigoCuenta: string;
  nombreCuenta: string;
  saldoInicial: number;
  saldosMensuales: { fecha: string; valor: number }[];
  fechaRegistro: string;
}

interface ReadOnlyBalanceTableProps {
  balances?: BalanceItem[];
}

export default function ReadOnlyBalanceTable({ balances = [] }: ReadOnlyBalanceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBalances = balances.filter(
    (bal) =>
      bal.nombreCuenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bal.codigoCuenta.includes(searchTerm)
  );

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden max-w-6xl mx-auto backdrop-blur-md">
      {/* Header / Security Warning Banner */}
      <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Balances y Cuentas Contables</h3>
              <p className="text-xs text-slate-400 mt-0.5">Módulo Bloqueado - Solo Lectura</p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 self-start md:self-center px-4 py-2 bg-amber-50/80 border border-amber-200/60 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-semibold text-amber-800">
            Datos transaccionales protegidos por el sistema
          </span>
        </div>
      </div>

      {/* Audit Search & Metadata */}
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <span className="absolute left-3 top-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por cuenta o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-300 transition-all"
          />
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Total registros: {filteredBalances.length}</span>
          <span className="text-slate-300">•</span>
          <span>Fecha corte: 31/12/2025</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-slate-100/80 text-slate-700 uppercase text-xs font-semibold tracking-wider border-b border-slate-200/60">
            <tr>
              <th className="px-6 py-3.5">Código Cuenta</th>
              <th className="px-6 py-3.5">Nivel</th>
              <th className="px-6 py-3.5">Nombre de Cuenta</th>
              <th className="px-6 py-3.5 text-right">Saldo Inicial ($)</th>
              {balances.length > 0 && balances[0].saldosMensuales?.map((sm) => (
                <th key={sm.fecha} className="px-6 py-3.5 text-right">
                  Saldo {sm.fecha} ($)
                </th>
              ))}
              <th className="px-6 py-3.5 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 bg-white/70">
            {filteredBalances.length > 0 ? (
              filteredBalances.map((bal) => {
                // Formatting styles based on Level
                const isGroup = bal.nivel <= 2;
                return (
                  <tr
                    key={bal.id}
                    className={`hover:bg-slate-50/50 transition-colors ${
                      isGroup ? "bg-slate-50/40 font-semibold" : ""
                    }`}
                  >
                    <td className={`px-6 py-4 font-mono text-xs ${isGroup ? "text-slate-900" : "text-slate-500"}`}>
                      {bal.codigoCuenta}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      Nivel {bal.nivel}
                    </td>
                    <td className={`px-6 py-4 ${isGroup ? "text-slate-900" : "text-slate-700"}`}>
                      <div className="flex items-center gap-2">
                        {isGroup && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        )}
                        {bal.nombreCuenta}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${isGroup ? "text-slate-900" : "text-slate-700"}`}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(bal.saldoInicial)}
                    </td>
                    {bal.saldosMensuales?.map((sm, i) => (
                      <td key={i} className={`px-6 py-4 text-right font-medium ${isGroup ? "text-slate-900" : "text-slate-600"}`}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(sm.valor)}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/50">
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Bloqueado
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 bg-white">
                  No se encontraron cuentas contables que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
