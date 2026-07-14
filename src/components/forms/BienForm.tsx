"use client";

import { useState } from "react";

export interface BienData {
  id?: number;
  tipoBien: string;
  descripcion: string;
  existenciaFisica: boolean;
  numeroIdentificacion: string;
  ubicacionCanton: string;
  saldoLibros: number;
  valorAvaluo: number;
  disponibilidad: string;
  fechaVenta?: string;
  valorVenta?: number;
  tipoVenta?: string;
  compradorId?: string;
  razonSocialComprador?: string;
}

interface BienFormProps {
  initialData?: BienData;
  onSubmit: (data: BienData) => void;
  onCancel?: () => void;
}

export default function BienForm({ initialData, onSubmit, onCancel }: BienFormProps) {
  const [formData, setFormData] = useState<BienData>({
    tipoBien: initialData?.tipoBien || "Inmueble",
    descripcion: initialData?.descripcion || "",
    existenciaFisica: initialData?.existenciaFisica ?? true,
    numeroIdentificacion: initialData?.numeroIdentificacion || "",
    ubicacionCanton: initialData?.ubicacionCanton || "",
    saldoLibros: initialData?.saldoLibros || 0,
    valorAvaluo: initialData?.valorAvaluo || 0,
    disponibilidad: initialData?.disponibilidad || "Disponible",
    fechaVenta: initialData?.fechaVenta || "",
    valorVenta: initialData?.valorVenta || 0,
    tipoVenta: initialData?.tipoVenta || "",
    compradorId: initialData?.compradorId || "",
    razonSocialComprador: initialData?.razonSocialComprador || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === "number") {
      finalValue = parseFloat(value) || 0;
    } else if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      existenciaFisica: e.target.checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-4xl mx-auto space-y-8 backdrop-blur-md">
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
          {initialData ? "Modificar Bien" : "Registrar Nuevo Bien"}
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Ingrese los detalles técnicos y financieros del activo de la entidad en liquidación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Bien */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo de Bien</label>
          <select
            name="tipoBien"
            value={formData.tipoBien}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="Inmueble">Inmueble</option>
            <option value="Vehículo">Vehículo</option>
            <option value="Muebles y Enseres">Muebles y Enseres</option>
            <option value="Equipos de Computación">Equipos de Computación</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        {/* Número de Identificación */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">No. de Identificación / Placa / Catastro</label>
          <input
            type="text"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleChange}
            placeholder="Ej. ABS-1234 o Predio 4567"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Descripción (Full Width) */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Descripción del Bien</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Proporcione detalles de la marca, modelo, estado físico, dirección exacta, etc."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Cantón Ubicación */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Ubicación Cantón</label>
          <input
            type="text"
            name="ubicacionCanton"
            value={formData.ubicacionCanton}
            onChange={handleChange}
            placeholder="Ej. Quito, Guayaquil, Cuenca"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Disponibilidad */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Disponibilidad del Bien</label>
          <select
            name="disponibilidad"
            value={formData.disponibilidad}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="Disponible">Disponible</option>
            <option value="Vendido">Vendido</option>
            <option value="Con Impedimento Legal">Con Impedimento Legal</option>
            <option value="En Proceso de Remate">En Proceso de Remate</option>
          </select>
        </div>

        {/* Saldo en Libros */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Saldo en Libros ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400 font-medium text-sm">$</span>
            <input
              type="number"
              step="0.01"
              name="saldoLibros"
              value={formData.saldoLibros}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Valor Avalúo Perito */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Valor Avalúo Perito ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400 font-medium text-sm">$</span>
            <input
              type="number"
              step="0.01"
              name="valorAvaluo"
              value={formData.valorAvaluo}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-3 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Existencia Física Checkbox */}
        <div className="flex items-center space-x-3 p-3 md:col-span-2">
          <input
            type="checkbox"
            id="existenciaFisica"
            checked={formData.existenciaFisica}
            onChange={handleCheckboxChange}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="existenciaFisica" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
            ¿Existe físicamente el bien? (Verificación física en bodega/inspección)
          </label>
        </div>
      </div>

      {/* Sección Condicional: Datos de Venta */}
      {formData.disponibilidad === "Vendido" && (
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 space-y-6 transition-all duration-300 animate-fadeIn">
          <h4 className="text-md font-bold text-slate-800 border-b border-slate-200 pb-2">Información del Proceso de Venta</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Fecha de Venta</label>
              <input
                type="date"
                name="fechaVenta"
                value={formData.fechaVenta}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Valor de Venta ($)</label>
              <input
                type="number"
                step="0.01"
                name="valorVenta"
                value={formData.valorVenta}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Identificación Comprador (RUC/Cédula)</label>
              <input
                type="text"
                name="compradorId"
                value={formData.compradorId}
                onChange={handleChange}
                placeholder="RUC o Cédula"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Razón Social Comprador</label>
              <input
                type="text"
                name="razonSocialComprador"
                value={formData.razonSocialComprador}
                onChange={handleChange}
                placeholder="Nombres y Apellidos o Compañía"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
          </div>
        </div>
      )}

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
