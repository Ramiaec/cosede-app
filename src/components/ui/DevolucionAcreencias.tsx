"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { DepositoData, PagoAcreencia } from "../forms/DepositoForm";
import { InicioData } from "../forms/InicioForm";

interface DevolucionAcreenciasProps {
  depositos: DepositoData[];
  setDepositos: React.Dispatch<React.SetStateAction<DepositoData[]>>;
  inicioData: InicioData;
  setInicioData: React.Dispatch<React.SetStateAction<InicioData>>;
}

export default function DevolucionAcreencias({
  depositos,
  setDepositos,
  inicioData,
  setInicioData,
}: DevolucionAcreenciasProps) {
  const [activeFase, setActiveFase] = useState<number>(1);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Fase 2 states
  const [montoDisponibleGap, setMontoDisponibleGap] = useState<number>(0);

  // Fase 3 states
  const [recursosDisponibles, setRecursosDisponibles] = useState<number>(0);
  const [gastosOperacion, setGastosOperacion] = useState<number>(0);

  // Generar ID único
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // FASE 1: Carga de archivo COSEDE
  const handleUploadCosede = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        let newErrors: string[] = [];
        let updatedDepositos = [...depositos];
        let totalSubrogadoCosede = 0;
        const fechaPago = new Date().toISOString().split("T")[0];

        data.forEach((row, index) => {
          const idAcreedor = String(row["ID ACREEDOR"] || "").trim();
          const montoPagado = parseFloat(row["MONTO PAGADO SEGURO"]) || 0;

          if (!idAcreedor || montoPagado <= 0) return;

          const depIndex = updatedDepositos.findIndex((d) => d.idAcreedor === idAcreedor);
          if (depIndex === -1) {
            newErrors.push(`Fila ${index + 2}: No se encontró el ID Acreedor ${idAcreedor}.`);
            return;
          }

          const dep = updatedDepositos[depIndex];

          if (dep.vinculado === "SI") {
            newErrors.push(`Fila ${index + 2}: ERROR CRÍTICO. El acreedor ${dep.nombreAcreedor} (${idAcreedor}) es VINCULADO. No procede el pago de COSEDE.`);
            return;
          }

          if (montoPagado > (dep.saldoPendiente || dep.saldoTotal)) {
            newErrors.push(`Fila ${index + 2}: El monto a pagar (${montoPagado}) supera el saldo pendiente del acreedor ${dep.nombreAcreedor}.`);
            return;
          }

          // Registrar el pago y reducir el saldo
          const nuevoPago: PagoAcreencia = {
            id: generateId(),
            fecha: fechaPago,
            fase: "Fase 1: COSEDE",
            monto: montoPagado,
          };

          const saldoAnterior = dep.saldoPendiente !== undefined ? dep.saldoPendiente : dep.saldoTotal;
          
          updatedDepositos[depIndex] = {
            ...dep,
            saldoPendiente: saldoAnterior - montoPagado,
            pagos: [...(dep.pagos || []), nuevoPago],
          };

          totalSubrogadoCosede += montoPagado;
        });

        if (newErrors.length > 0) {
          setErrorLogs(newErrors);
          setSuccessMessage("");
        } else {
          setDepositos(updatedDepositos);
          setInicioData((prev) => ({
            ...prev,
            contingenteCosede: (prev.contingenteCosede || 0) + totalSubrogadoCosede,
          }));
          setErrorLogs([]);
          setSuccessMessage(`Fase 1 completada con éxito. Se actualizó el saldo de depositantes y la subrogación de COSEDE sumó $${totalSubrogadoCosede.toFixed(2)}.`);
        }
      } catch (err) {
        setErrorLogs(["Error al procesar el archivo Excel. Asegúrate de que tiene las columnas 'ID ACREEDOR' y 'MONTO PAGADO SEGURO'."]);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ""; // reset
  };

  // FASE 2: Pago GAP
  const handlePagoGap = () => {
    let gapsPendientes = depositos.filter((d) => d.gap === "SI" && (d.saldoPendiente !== undefined ? d.saldoPendiente : d.saldoTotal) > 0);
    
    if (gapsPendientes.length === 0) {
      setErrorLogs(["No hay acreedores GAP con saldo pendiente."]);
      return;
    }

    if (montoDisponibleGap <= 0) {
      setErrorLogs(["El monto disponible debe ser mayor a 0."]);
      return;
    }

    const totalDeudaGap = gapsPendientes.reduce((sum, d) => sum + (d.saldoPendiente !== undefined ? d.saldoPendiente : d.saldoTotal), 0);
    const updatedDepositos = [...depositos];
    const fechaPago = new Date().toISOString().split("T")[0];

    // Distribuir el pago. Si alcanza para todo, se paga el saldo pendiente. Si no, a prorrata.
    const factorProrrata = montoDisponibleGap >= totalDeudaGap ? 1 : montoDisponibleGap / totalDeudaGap;

    let totalPagado = 0;

    gapsPendientes.forEach((gapDep) => {
      const depIndex = updatedDepositos.findIndex((d) => d.id === gapDep.id);
      if (depIndex === -1) return;

      const saldoAnterior = gapDep.saldoPendiente !== undefined ? gapDep.saldoPendiente : gapDep.saldoTotal;
      const montoAPagar = parseFloat((saldoAnterior * factorProrrata).toFixed(2));
      
      if (montoAPagar <= 0) return;

      const nuevoPago: PagoAcreencia = {
        id: generateId(),
        fecha: fechaPago,
        fase: "Fase 2: GAP",
        monto: montoAPagar,
      };

      updatedDepositos[depIndex] = {
        ...gapDep,
        saldoPendiente: saldoAnterior - montoAPagar,
        pagos: [...(gapDep.pagos || []), nuevoPago],
      };

      totalPagado += montoAPagar;
    });

    setDepositos(updatedDepositos);
    setErrorLogs([]);
    setSuccessMessage(`Pago Fase 2 (GAP) realizado. Total distribuido: $${totalPagado.toFixed(2)} a prorrata (${(factorProrrata * 100).toFixed(2)}%).`);
    setMontoDisponibleGap(0);
  };

  // FASE 3: Pago Proporcional (Orden 4)
  const handlePagoProporcional = () => {
    // Validar que no haya GAPs pendientes
    const gapsPendientes = depositos.filter((d) => d.gap === "SI" && (d.saldoPendiente !== undefined ? d.saldoPendiente : d.saldoTotal) > 0);
    if (gapsPendientes.length > 0) {
      setErrorLogs(["No se puede generar esta fase de pago porque aún existen acreedores GAP con saldo pendiente."]);
      return;
    }

    const montoEfectivoDisponible = recursosDisponibles - gastosOperacion;
    if (montoEfectivoDisponible <= 0) {
      setErrorLogs(["El monto efectivo disponible (Recursos - Gastos) debe ser mayor a 0."]);
      return;
    }

    // Base íntegra: Depositantes con saldo pendiente > 0 + COSEDE
    const depositantesPendientes = depositos.filter((d) => (d.saldoPendiente !== undefined ? d.saldoPendiente : d.saldoTotal) > 0);
    const contingenteCosede = inicioData.contingenteCosede || 0;

    const totalDeudaIntegra = depositantesPendientes.reduce((sum, d) => sum + (d.saldoPendiente !== undefined ? d.saldoPendiente : d.saldoTotal), 0) + contingenteCosede;

    if (totalDeudaIntegra <= 0) {
      setErrorLogs(["No hay deudas pendientes por pagar."]);
      return;
    }

    const factorProrrata = montoEfectivoDisponible >= totalDeudaIntegra ? 1 : montoEfectivoDisponible / totalDeudaIntegra;
    const updatedDepositos = [...depositos];
    const fechaPago = new Date().toISOString().split("T")[0];

    let totalDepositantesPagado = 0;

    depositantesPendientes.forEach((dep) => {
      const depIndex = updatedDepositos.findIndex((d) => d.id === dep.id);
      if (depIndex === -1) return;

      const saldoAnterior = dep.saldoPendiente !== undefined ? dep.saldoPendiente : dep.saldoTotal;
      const montoAPagar = parseFloat((saldoAnterior * factorProrrata).toFixed(2));

      if (montoAPagar <= 0) return;

      const nuevoPago: PagoAcreencia = {
        id: generateId(),
        fecha: fechaPago,
        fase: "Fase 3: Proporcional",
        monto: montoAPagar,
      };

      updatedDepositos[depIndex] = {
        ...dep,
        saldoPendiente: saldoAnterior - montoAPagar,
        pagos: [...(dep.pagos || []), nuevoPago],
      };

      totalDepositantesPagado += montoAPagar;
    });

    const pagoCosede = parseFloat((contingenteCosede * factorProrrata).toFixed(2));
    const nuevoContingente = contingenteCosede - pagoCosede;

    setDepositos(updatedDepositos);
    setInicioData((prev) => ({
      ...prev,
      contingenteCosede: nuevoContingente >= 0 ? nuevoContingente : 0,
    }));
    
    setErrorLogs([]);
    setSuccessMessage(`Fase 3 ejecutada. Pago a Depositantes: $${totalDepositantesPagado.toFixed(2)}. Pago a COSEDE: $${pagoCosede.toFixed(2)}.`);
    setRecursosDisponibles(0);
    setGastosOperacion(0);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Devolución de Acreencias</h2>
        <p className="text-sm text-slate-500 mt-1">Prelación de Pagos (Art. 315 y Art. 12 Código Monetario Financiero)</p>
      </div>

      {errorLogs.length > 0 && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
          <h4 className="text-red-800 font-bold text-sm mb-2">Errores / Alertas:</h4>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errorLogs.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-sm font-semibold text-emerald-800">
          ✓ {successMessage}
        </div>
      )}

      <div className="flex gap-2 border-b border-slate-200">
        {[1, 2, 3].map((fase) => (
          <button
            key={fase}
            onClick={() => { setActiveFase(fase); setErrorLogs([]); setSuccessMessage(""); }}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-[1px] ${
              activeFase === fase ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {fase === 1 ? "Fase 1: Seguro COSEDE" : fase === 2 ? "Fase 2: Pagos GAP" : "Fase 3: Proporcional (Orden 4)"}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {activeFase === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Fase 1: Seguro de Depósitos (COSEDE)</h3>
            <p className="text-sm text-slate-600">Suba el archivo Excel con los pagos realizados por el Seguro de Depósitos. <strong>Columnas obligatorias:</strong> ID ACREEDOR y MONTO PAGADO SEGURO.</p>
            <div className="mt-4 p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center hover:bg-slate-100 transition-colors">
              <input type="file" accept=".xlsx,.xls" id="cosede-upload" className="hidden" onChange={handleUploadCosede} />
              <label htmlFor="cosede-upload" className="cursor-pointer flex flex-col items-center">
                <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <span className="text-sm font-semibold text-slate-700">Subir Plantilla Pagos COSEDE</span>
                <span className="text-xs text-slate-400 mt-1">.xlsx, .xls</span>
              </label>
            </div>
            <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
              <span className="text-sm font-bold text-blue-800">Contingente COSEDE Actual:</span>
              <span className="text-xl font-black text-blue-900">${(inicioData.contingenteCosede || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}

        {activeFase === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Fase 2: Pagos a Grupos de Atención Prioritaria (GAP)</h3>
            <p className="text-sm text-slate-600">Este pago se distribuirá únicamente entre los acreedores con la marca GAP = "SI". Si el monto no cubre la totalidad, se pagará a prorrata.</p>
            
            <div className="flex gap-4 items-end mt-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Monto Disponible a Repartir ($)</label>
                <input
                  type="number"
                  value={montoDisponibleGap || ""}
                  onChange={(e) => setMontoDisponibleGap(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
                  placeholder="0.00"
                />
              </div>
              <button onClick={handlePagoGap} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md transition-all">
                Ejecutar Pago GAP
              </button>
            </div>
          </div>
        )}

        {activeFase === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Fase 3: Pago Proporcional (Orden 4)</h3>
            <p className="text-sm text-slate-600">Se pagará proporcionalmente a todos los depositantes y a COSEDE, de acuerdo al Art. 12.</p>
            <div className="bg-orange-50 text-orange-800 border-l-4 border-orange-500 p-3 rounded-r-lg text-xs font-semibold mb-4">
              IMPORTANTE: Esta fase solo puede ejecutarse si todos los GAP han sido pagados en su totalidad.
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">1. Recursos Económicos Disponibles ($)</label>
                <input
                  type="number"
                  value={recursosDisponibles || ""}
                  onChange={(e) => setRecursosDisponibles(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">2. Gastos de Operación ($)</label>
                <input
                  type="number"
                  value={gastosOperacion || ""}
                  onChange={(e) => setGastosOperacion(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">Monto Efectivo Disponible:</span>
              <span className="text-lg font-black text-emerald-600">${Math.max(0, recursosDisponibles - gastosOperacion).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>

            <button onClick={handlePagoProporcional} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-all mt-4">
              Calcular y Ejecutar Pago Proporcional
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
