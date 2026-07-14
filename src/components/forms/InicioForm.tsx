"use client";

import { useState } from "react";

export interface InicioData {
  rucCooperativa: string;
  razonSocial: string;
  tipoIdLiquidador: string;
  idLiquidador: string;
  nombreLiquidador: string;
  tipoLiquidacion: string;
  aplicaSeguro: string;
  fechaLineaBase: string;
  fechaCorte: string;
}

interface InicioFormProps {
  initialData?: InicioData;
  onSubmit: (data: InicioData) => void;
}

export default function InicioForm({ initialData, onSubmit }: InicioFormProps) {
  const [formData, setFormData] = useState<InicioData>({
    rucCooperativa: initialData?.rucCooperativa || "",
    razonSocial: initialData?.razonSocial || "",
    tipoIdLiquidador: initialData?.tipoIdLiquidador || "R",
    idLiquidador: initialData?.idLiquidador || "",
    nombreLiquidador: initialData?.nombreLiquidador || "",
    tipoLiquidacion: initialData?.tipoLiquidacion || "Forzosa",
    aplicaSeguro: initialData?.aplicaSeguro || "SI",
    fechaLineaBase: initialData?.fechaLineaBase || "",
    fechaCorte: initialData?.fechaCorte || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-4xl mx-auto space-y-8 backdrop-blur-md">
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
          Datos de Configuración del Operativo (INICIO)
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Registre la información general de la entidad en liquidación y del liquidador responsable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Razón Social */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Razón Social de la COAC</label>
          <input
            type="text"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            placeholder="Ej. Cooperativa de Ahorro y Crédito Ejemplo"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* RUC Cooperativa */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">RUC de la Cooperativa</label>
          <input
            type="text"
            name="rucCooperativa"
            value={formData.rucCooperativa}
            onChange={handleChange}
            placeholder="Ej. 1790000000001"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Nombres Liquidador */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Nombres y Apellidos del Liquidador</label>
          <input
            type="text"
            name="nombreLiquidador"
            value={formData.nombreLiquidador}
            onChange={handleChange}
            placeholder="Nombres completos"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Tipo ID Liquidador */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo Identificación Liquidador</label>
          <select
            name="tipoIdLiquidador"
            value={formData.tipoIdLiquidador}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="R">RUC (Registro Único de Contribuyentes)</option>
            <option value="C">Cédula de Identidad</option>
            <option value="P">Pasaporte</option>
          </select>
        </div>

        {/* ID Liquidador */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">No. de Identificación Liquidador</label>
          <input
            type="text"
            name="idLiquidador"
            value={formData.idLiquidador}
            onChange={handleChange}
            placeholder="Ej. 1712345678001"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Tipo Liquidacion */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo de Liquidación</label>
          <select
            name="tipoLiquidacion"
            value={formData.tipoLiquidacion}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="Forzosa">Forzosa</option>
            <option value="Voluntaria">Voluntaria</option>
          </select>
        </div>

        {/* Aplica Seguro */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Aplica Pago de Seguro de Depósitos</label>
          <select
            name="aplicaSeguro"
            value={formData.aplicaSeguro}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="SI">SÍ</option>
            <option value="NO">NO</option>
          </select>
        </div>

        {/* Fecha Línea Base */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Fecha Línea Base (Inicio Operativo)</label>
          <input
            type="date"
            name="fechaLineaBase"
            value={formData.fechaLineaBase}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Fecha Corte */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Fecha de Corte del Reporte</label>
          <input
            type="date"
            name="fechaCorte"
            value={formData.fechaCorte}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          Guardar Configuración Inicial
        </button>
      </div>
    </form>
  );
}
