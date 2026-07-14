"use client";

import { useState } from "react";

export interface CarteraData {
  id?: number;
  codigoSocio: string;
  tipoIdSocio: string;
  validadorIdSocio: string;
  numeroOperacion: string;
  idCliente: string;
  relacion: string;
  nombreSocio: string;
  estadoCivil: string;
  saldoFecha: number;
}

interface CarteraFormProps {
  initialData?: CarteraData;
  onSubmit: (data: CarteraData) => void;
  onCancel?: () => void;
}

export default function CarteraForm({ initialData, onSubmit, onCancel }: CarteraFormProps) {
  const [formData, setFormData] = useState<CarteraData>({
    codigoSocio: initialData?.codigoSocio || "",
    tipoIdSocio: initialData?.tipoIdSocio || "C",
    validadorIdSocio: initialData?.validadorIdSocio || "VALIDO",
    numeroOperacion: initialData?.numeroOperacion || "",
    idCliente: initialData?.idCliente || "",
    relacion: initialData?.relacion || "DEUDOR",
    nombreSocio: initialData?.nombreSocio || "",
    estadoCivil: initialData?.estadoCivil || "SOLTERO(A)",
    saldoFecha: initialData?.saldoFecha || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "saldoFecha" ? parseFloat(value) || 0 : value,
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
          {initialData ? "Modificar Operación" : "Registrar Operación de Cartera (CARTERA Y JUICIOS)"}
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Ingrese los detalles del socio y el estado del crédito y saldo de cartera.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código Socio */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Código de Socio</label>
          <input
            type="text"
            name="codigoSocio"
            value={formData.codigoSocio}
            onChange={handleChange}
            placeholder="Ej. SOC-001"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Número de Operación */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Número de Operación</label>
          <input
            type="text"
            name="numeroOperacion"
            value={formData.numeroOperacion}
            onChange={handleChange}
            placeholder="Ej. OP-45678"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Nombres Socio */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Apellidos y Nombres del Socio / Deudor</label>
          <input
            type="text"
            name="nombreSocio"
            value={formData.nombreSocio}
            onChange={handleChange}
            placeholder="Nombres completos"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Tipo ID Socio */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipo Identificación Socio</label>
          <select
            name="tipoIdSocio"
            value={formData.tipoIdSocio}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="C">Cédula</option>
            <option value="R">RUC</option>
            <option value="P">Pasaporte</option>
          </select>
        </div>

        {/* ID Cliente */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Identificación Socio (No. Documento)</label>
          <input
            type="text"
            name="idCliente"
            value={formData.idCliente}
            onChange={handleChange}
            placeholder="Ej. 1712345678"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Validador ID Socio */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Validador de ID Socio</label>
          <select
            name="validadorIdSocio"
            value={formData.validadorIdSocio}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="VALIDO">VÁLIDO</option>
            <option value="INCORRECTO">INCORRECTO</option>
          </select>
        </div>

        {/* Relacion */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Relación (Rol)</label>
          <select
            name="relacion"
            value={formData.relacion}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="DEUDOR">DEUDOR</option>
            <option value="CODEUDOR">CODEUDOR</option>
            <option value="GARANTE">GARANTE</option>
          </select>
        </div>

        {/* Estado Civil */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Estado Civil</label>
          <select
            name="estadoCivil"
            value={formData.estadoCivil}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-200"
          >
            <option value="SOLTERO(A)">SOLTERO(A)</option>
            <option value="CASADO(A)">CASADO(A)</option>
            <option value="DIVORCIADO(A)">DIVORCIADO(A)</option>
            <option value="VIUDO(A)">VIUDO(A)</option>
            <option value="UNION DE HECHO">UNIÓN DE HECHO</option>
          </select>
        </div>

        {/* Saldo Fecha */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Saldo Cartera a la Fecha ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-400 font-medium text-sm">$</span>
            <input
              type="number"
              step="0.01"
              name="saldoFecha"
              value={formData.saldoFecha}
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
