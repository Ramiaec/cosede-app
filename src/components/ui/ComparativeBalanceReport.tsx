"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BalanceItem } from "./ReadOnlyBalanceTable";

interface ComparativeBalanceReportProps {
  balances: BalanceItem[];
  cooperativaName: string;
}

export default function ComparativeBalanceReport({ balances, cooperativaName }: ComparativeBalanceReportProps) {
  const [showModal, setShowModal] = useState(false);
  const [basePeriod, setBasePeriod] = useState<string>("INITIAL");
  const [comparePeriod, setComparePeriod] = useState<string>("");
  const [maxLevel, setMaxLevel] = useState<number>(6);
  const [hideZeros, setHideZeros] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract available months
  const periodosMensuales = balances.length > 0 
    ? (balances[0].saldosMensuales?.map(s => s.fecha) || [])
    : [];

  // Calculate variances
  const processedBalances = balances.map(bal => {
    const valBase = basePeriod === "INITIAL" ? bal.saldoInicial : (bal.saldosMensuales?.find(s => s.fecha === basePeriod)?.valor || 0);
    const valComp = comparePeriod === "INITIAL" ? bal.saldoInicial : (bal.saldosMensuales?.find(s => s.fecha === comparePeriod)?.valor || 0);
    
    const changeAbs = valComp - valBase;
    const changePct = valBase === 0 ? (valComp !== 0 ? 100 : 0) : (changeAbs / Math.abs(valBase)) * 100;
    
    return {
      ...bal,
      valBase,
      valComp,
      changeAbs,
      changePct
    };
  }).filter(bal => bal.nivel <= maxLevel)
    .filter(bal => !hideZeros || (bal.valBase !== 0 || bal.valComp !== 0));

  const handlePrint = () => {
    setShowModal(false);
    // Give state time to close the modal visually before print dialog opens
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 print:hidden"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        Generar Reporte Comparativo (PDF)
      </button>

      {mounted && showModal && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Configurar Reporte Comparativo</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Periodo Base</label>
                <select value={basePeriod} onChange={e => setBasePeriod(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="INITIAL">Saldo Inicial</option>
                  {periodosMensuales.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Periodo a Comparar</label>
                <select value={comparePeriod} onChange={e => setComparePeriod(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="" disabled>Seleccione un periodo</option>
                  <option value="INITIAL">Saldo Inicial</option>
                  {periodosMensuales.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nivel Máximo de Cuenta (Desglose)</label>
                <select value={maxLevel} onChange={e => setMaxLevel(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>Nivel {n}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <input type="checkbox" id="hideZeros" checked={hideZeros} onChange={e => setHideZeros(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="hideZeros" className="text-sm font-semibold text-slate-700 cursor-pointer">Ocultar cuentas con saldos en cero ($0.00)</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
              <button onClick={handlePrint} disabled={!comparePeriod || basePeriod === comparePeriod} className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm shadow-indigo-500/20">
                Previsualizar e Imprimir
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Printable View */}
      {mounted && createPortal(
        <div className="hidden print:block absolute top-0 left-0 w-full min-h-screen bg-white text-black p-8 z-[9999]">
          <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">{cooperativaName || "COOPERATIVA EN LIQUIDACIÓN"}</h1>
          <h2 className="text-lg font-semibold text-slate-700 mt-2">ESTADO DE SITUACIÓN FINANCIERA COMPARATIVO</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Periodo Base: <span className="text-slate-800">{basePeriod === "INITIAL" ? "Saldo Inicial" : basePeriod}</span> &nbsp;|&nbsp; 
            Periodo Actual: <span className="text-slate-800">{comparePeriod === "INITIAL" ? "Saldo Inicial" : comparePeriod}</span>
          </p>
        </div>

        <table className="w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-800 text-slate-800">
              <th className="py-2.5 px-2 uppercase tracking-wider">Cuenta</th>
              <th className="py-2.5 px-2 text-right uppercase tracking-wider">{basePeriod === "INITIAL" ? "Inicial" : basePeriod}</th>
              <th className="py-2.5 px-2 text-right uppercase tracking-wider">{comparePeriod === "INITIAL" ? "Inicial" : comparePeriod}</th>
              <th className="py-2.5 px-2 text-right uppercase tracking-wider">Variación ($)</th>
              <th className="py-2.5 px-2 text-right uppercase tracking-wider">Variación (%)</th>
            </tr>
          </thead>
          <tbody>
            {processedBalances.map(bal => {
              const isGroup = bal.nivel <= 2;
              const hasValBase = bal.valBase !== 0;
              const hasValComp = bal.valComp !== 0;
              
              return (
                <tr key={bal.id} className={`border-b border-slate-200/50 ${isGroup ? 'font-bold bg-slate-50' : ''}`}>
                  <td className="py-2 px-2" style={{ paddingLeft: `${(bal.nivel - 1) * 16 + 8}px` }}>
                    <span className="text-slate-500 mr-2">{bal.codigoCuenta}</span>
                    <span className={isGroup ? 'text-slate-900' : 'text-slate-700'}>{bal.nombreCuenta}</span>
                  </td>
                  <td className={`py-2 px-2 text-right ${!hasValBase ? 'text-slate-300' : ''}`}>
                    {hasValBase ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bal.valBase) : "-"}
                  </td>
                  <td className={`py-2 px-2 text-right ${!hasValComp ? 'text-slate-300' : ''}`}>
                    {hasValComp ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bal.valComp) : "-"}
                  </td>
                  
                  {/* Variación Absoluta */}
                  <td className={`py-2 px-2 text-right font-medium ${bal.changeAbs > 0 ? 'text-blue-700' : bal.changeAbs < 0 ? 'text-red-700' : 'text-slate-400'}`}>
                    {bal.changeAbs > 0 ? '▲ ' : bal.changeAbs < 0 ? '▼ ' : ''}
                    {bal.changeAbs !== 0 ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(bal.changeAbs)) : "-"}
                  </td>
                  
                  {/* Variación Porcentual */}
                  <td className={`py-2 px-2 text-right font-bold ${bal.changePct > 0 ? 'text-blue-700' : bal.changePct < 0 ? 'text-red-700' : 'text-slate-400'}`}>
                    {bal.changeAbs === 0 ? '-' : `${bal.changePct > 0 ? '+' : ''}${bal.changePct.toFixed(2)}%`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        <div className="mt-12 pt-8 border-t border-slate-300 flex justify-between px-16 text-xs text-slate-500 font-bold uppercase tracking-wider">
          <div className="text-center">
            <div className="w-48 border-b border-slate-400 mb-2"></div>
            Liquidación
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-slate-400 mb-2"></div>
            Auditoría
          </div>
        </div>
      </div>,
      document.body
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 20px;
          }
        }
      `}} />
    </>
  );
}
