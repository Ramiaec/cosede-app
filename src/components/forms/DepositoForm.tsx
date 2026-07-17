"use client";

import { useState } from "react";

export interface PagoAcreencia {
  id: string;
  fecha: string;
  fase: string;
  monto: number;
}

export interface DepositoData {
  id?: number;
  numeroRegistro: number;
  tipoPersona: string;
  validadorId: string;
  tipoIdAcreedor: string;
  idAcreedor: string;
  nombreAcreedor: string;
  agenciaCanton: string;
  vinculado: string;
  tipoVinculado: string;
  gap: string;
  tipoGap: string;
  saldoTotal: number;
  saldoPendiente?: number;
  pagos?: PagoAcreencia[];
}

interface DepositoFormProps {
  initialData?: DepositoData;
  onSubmit: (data: DepositoData) => void;
  onCancel?: () => void;
}

export default function DepositoForm({ initialData, onSubmit, onCancel }: DepositoFormProps) {
  const [formData, setFormData] = useState<DepositoData>({
    numeroRegistro: initialData?.numeroRegistro || 1,
    tipoPersona: initialData?.tipoPersona || "Natural",
    validadorId: initialData?.validadorId || "VALIDO",
    tipoIdAcreedor: initialData?.tipoIdAcreedor || "C",
    idAcreedor: initialData?.idAcreedor || "",
    nombreAcreedor: initialData?.nombreAcreedor || "",
    agenciaCanton: initialData?.agenciaCanton || "",
    vinculado: initialData?.vinculado || "NO",
    tipoVinculado: initialData?.tipoVinculado || "",
    gap: initialData?.gap || "NO",
    tipoGap: initialData?.tipoGap || "",
    saldoTotal: initialData?.saldoTotal || 0,
    saldoPendiente: initialData?.saldoPendiente !== undefined ? initialData.saldoPendiente : initialData?.saldoTotal || 0,
    pagos: initialData?.pagos || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const isNumeric = name === "saldoTotal" || name === "numeroRegistro";
      const val = isNumeric ? parseFloat(value) || 0 : value;
      
      const updated: any = {
        ...prev,
        [name]: val,
      };

      if (name === "saldoTotal") {
        updated.saldoPendiente = val;
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-4xl mx-auto space-y-8 backdrop-blur-md">
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
          {initialData ? "Modificar Acreedor" : "Registrar Acreedor/Depósito (DEPOSITOS)"}
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Ingrese la información del acreedor y los detalles del saldo de depósitos en liquidación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Número Registro */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">No. Registro</label>
          <input
            type="number"
            name="numeroRegistro"
            value={formData.numeroRegistro}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Tipo Persona */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo de Persona</label>
          <select
            name="tipoPersona"
            value={formData.tipoPersona}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="Natural">Natural</option>
            <option value="Jurídica">Jurídica</option>
          </select>
        </div>

        {/* Nombres Acreedor */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Apellidos y Nombres / Razón Social del Acreedor</label>
          <input
            type="text"
            name="nombreAcreedor"
            value={formData.nombreAcreedor}
            onChange={handleChange}
            placeholder="Nombres completos"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Tipo ID Acreedor */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo Identificación Acreedor</label>
          <select
            name="tipoIdAcreedor"
            value={formData.tipoIdAcreedor}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="C">Cédula</option>
            <option value="R">RUC</option>
            <option value="P">Pasaporte</option>
            <option value="N">No Registra</option>
          </select>
        </div>

        {/* ID Acreedor */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">No. Identificación Acreedor</label>
          <input
            type="text"
            name="idAcreedor"
            value={formData.idAcreedor}
            onChange={handleChange}
            placeholder="Ej. 1712345678"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          />
        </div>

        {/* Validador ID */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Validador de ID Socio</label>
          <select
            name="validadorId"
            value={formData.validadorId}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="VALIDO">VÁLIDO</option>
            <option value="NO REGISTRA ID">NO REGISTRA ID</option>
            <option value="INCORRECTO">INCORRECTO</option>
          </select>
        </div>

        {/* Agencia Cantón */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Agencia COAC en Liquidación (Cantón)</label>
          <input
            type="text"
            name="agenciaCanton"
            value={formData.agenciaCanton}
            onChange={handleChange}
            placeholder="Ej. Ambato, Quito"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Vinculado */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">¿Es Vinculado?</label>
          <select
            name="vinculado"
            value={formData.vinculado}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="NO">NO</option>
            <option value="SI">SÍ</option>
          </select>
        </div>

        {/* Tipo Vinculado */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo de Vinculación (Si aplica)</label>
          <input
            type="text"
            name="tipoVinculado"
            value={formData.tipoVinculado}
            onChange={handleChange}
            placeholder="Ej. Directivo, Cónyuge"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          />
        </div>

        {/* GAP */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">GAP (Grupo de Atención Prioritaria)</label>
          <select
            name="gap"
            value={formData.gap}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="NO">NO</option>
            <option value="SI">SÍ</option>
          </select>
        </div>

        {/* Tipo GAP */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo GAP (Si aplica)</label>
          <select
            name="tipoGap"
            value={formData.tipoGap}
            onChange={handleChange}
            disabled={formData.gap === "NO"}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200 disabled:opacity-50"
          >
            <option value="">Seleccione tipo GAP...</option>
            <option value="1.- Personas adultas mayores">1.- Personas adultas mayores</option>
            <option value="2.- Niñas, niños y adolescentes">2.- Niñas, niños y adolescentes</option>
            <option value="3.- Mujeres embarazadas">3.- Mujeres embarazadas</option>
            <option value="4.- Personas con discapacidad">4.- Personas con discapacidad</option>
            <option value="5.- Personas privadas de libertad">5.- Personas privadas de libertad</option>
            <option value="6.- Quienes adolezcan de enfermedades catastróficas o de alta complejidad">6.- Enfermedades catastróficas o alta complejidad</option>
          </select>
        </div>

        {/* Saldo Total */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Saldo Total de Depósitos ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400 font-medium text-sm">$</span>
            <input
              type="number"
              step="0.01"
              name="saldoTotal"
              value={formData.saldoTotal}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200 font-bold"
              required
            />
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          {initialData ? "Guardar Cambios" : "Guardar Registro"}
        </button>
      </div>
    </form>
  );
}
