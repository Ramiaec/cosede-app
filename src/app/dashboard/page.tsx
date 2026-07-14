"use client";

import { useState } from "react";
import BienForm, { BienData } from "../../components/forms/BienForm";
import ReadOnlyBalanceTable, { BalanceItem } from "../../components/ui/ReadOnlyBalanceTable";

// Mock initial data matching the Excel sheets' structure
const INITIAL_BIENES: BienData[] = [
  {
    id: 1,
    tipoBien: "Inmueble",
    descripcion: "Oficina matriz - Edificio La Previsora, Piso 10",
    existenciaFisica: true,
    numeroIdentificacion: "PRE-1002",
    ubicacionCanton: "Guayaquil",
    saldoLibros: 450000,
    valorAvaluo: 480000,
    disponibilidad: "Disponible",
  },
  {
    id: 2,
    tipoBien: "Vehículo",
    descripcion: "Camioneta Chevrolet Luv D-Max 4x4",
    existenciaFisica: true,
    numeroIdentificacion: "PEI-8932",
    ubicacionCanton: "Quito",
    saldoLibros: 18500,
    valorAvaluo: 16000,
    disponibilidad: "Disponible",
  },
  {
    id: 3,
    tipoBien: "Muebles y Enseres",
    descripcion: "Lote de escritorios y archivadores metálicos",
    existenciaFisica: true,
    numeroIdentificacion: "LOTE-MUE-01",
    ubicacionCanton: "Cuenca",
    saldoLibros: 5400,
    valorAvaluo: 3200,
    disponibilidad: "Vendido",
    fechaVenta: "2026-05-12",
    valorVenta: 3500,
    compradorId: "1792134568001",
    razonSocialComprador: "Muebles & Oficinas S.A.",
  },
];

const INITIAL_BALANCES: BalanceItem[] = [
  { id: 1, nivel: 1, codigoCuenta: "1", nombreCuenta: "ACTIVO", saldoMes: 1250430.22, fechaRegistro: "2026-06-30" },
  { id: 2, nivel: 2, codigoCuenta: "11", nombreCuenta: "FONDOS DISPONIBLES", saldoMes: 345120.15, fechaRegistro: "2026-06-30" },
  { id: 3, nivel: 4, codigoCuenta: "1101", nombreCuenta: "Caja", saldoMes: 4500.00, fechaRegistro: "2026-06-30" },
  { id: 4, nivel: 6, codigoCuenta: "110105", nombreCuenta: "Efectivo", saldoMes: 4500.00, fechaRegistro: "2026-06-30" },
  { id: 5, nivel: 2, codigoCuenta: "12", nombreCuenta: "OPERACIONES DE CRÉDITO", saldoMes: 685310.07, fechaRegistro: "2026-06-30" },
  { id: 6, nivel: 2, codigoCuenta: "14", nombreCuenta: "BIENES REALIZABLES", saldoMes: 220000.00, fechaRegistro: "2026-06-30" },
];

export default function DashboardPage() {
  const [bienes, setBienes] = useState<BienData[]>(INITIAL_BIENES);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bienes" | "balances" | "upload">("dashboard");
  const [showAddBien, setShowAddBien] = useState(false);
  const [editingBien, setEditingBien] = useState<BienData | null>(null);

  // States for Excel Upload Simulation
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Financial calculations from dynamic Bienes data
  const totalBienesLibros = bienes.reduce((acc, curr) => acc + curr.saldoLibros, 0);
  const totalBienesAvaluo = bienes.reduce((acc, curr) => acc + curr.valorAvaluo, 0);
  const totalBienesVendidos = bienes
    .filter((b) => b.disponibilidad === "Vendido")
    .reduce((acc, curr) => acc + (curr.valorVenta || 0), 0);

  // Handle Bien CRUD
  const handleAddBien = (newBien: BienData) => {
    setBienes((prev) => [
      ...prev,
      { ...newBien, id: prev.length + 1 },
    ]);
    setShowAddBien(false);
  };

  const handleEditBien = (updatedBien: BienData) => {
    setBienes((prev) =>
      prev.map((b) => (b.id === editingBien?.id ? { ...updatedBien, id: b.id } : b))
    );
    setEditingBien(null);
  };

  const handleDeleteBien = (id: number) => {
    if (confirm("¿Está seguro de eliminar este registro de bien realizable?")) {
      setBienes((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-xl">
        {/* Brand/Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-md leading-none tracking-tight">COSEDE - 1000</h1>
            <span className="text-xs text-slate-500">Gestión de Liquidación</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => { setActiveTab("dashboard"); setEditingBien(null); setShowAddBien(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard (REPORTE)
          </button>
          <button
            onClick={() => { setActiveTab("bienes"); setEditingBien(null); setShowAddBien(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "bienes"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 114 0v2m-4 0h4m-2 3v2m0 1v3m0 0h.01" />
            </svg>
            Bienes Realizables (CRUD)
          </button>
          <button
            onClick={() => { setActiveTab("balances"); setEditingBien(null); setShowAddBien(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "balances"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Balances (Solo Lectura)
          </button>
          <button
            onClick={() => { setActiveTab("upload"); setEditingBien(null); setShowAddBien(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "upload"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Cargar Excel (Ejemplo)
          </button>
        </nav>

        {/* User profile / Institution Tag */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950/20">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-blue-500 border border-slate-700/50">
            LIQ
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-slate-200">Liquidador Principal</p>
            <span className="text-xs text-slate-500">COSEDE Auditoria</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-150 px-8 flex items-center justify-between shadow-sm sticky top-0 z-40 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-500 border border-slate-200/50">
              Cooperativa en Liquidación RUC: 1790000000001
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">Último corte de datos</p>
              <p className="text-sm font-bold text-slate-700">30 de Junio, 2026</p>
            </div>
          </div>
        </header>

        {/* Page Content wrapper */}
        <div className="p-8 max-w-7xl w-full mx-auto flex-1 space-y-8">
          {/* TAB 1: DASHBOARD / REPORTE */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reporte Consolidado de Liquidación</h2>
                  <p className="text-slate-500 mt-1">Indicadores consolidados en tiempo real del proceso liquidatorio.</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg shadow-slate-950/10 text-sm font-bold transition-all flex items-center gap-2 self-start md:self-auto active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2zm5-17v2m-6 2H5" />
                  </svg>
                  Imprimir / Exportar Reporte
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group hover:shadow-md transition-all duration-200">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Activos (Libros)</h4>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                        INITIAL_BALANCES[0].saldoMes
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Dato consolidado del Balance de Corte
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group hover:shadow-md transition-all duration-200">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bienes Realizables (Avalúo)</h4>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                        totalBienesAvaluo
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span>Libros: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBienesLibros)}</span>
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group hover:shadow-md transition-all duration-200">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recuperación por Ventas</h4>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                        totalBienesVendidos
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-amber-600 font-semibold">
                    Dinero ingresado por realización de activos
                  </p>
                </div>
              </div>

              {/* Data Visualization Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Real-time recovery simulation */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">Avance de Realización de Bienes</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                        <span>Bienes Vendidos (Avalúo pericial realizado)</span>
                        <span>
                          {Math.round(
                            (bienes.filter((b) => b.disponibilidad === "Vendido").length / bienes.length) * 100
                          )}
                          % del Lote
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (bienes.filter((b) => b.disponibilidad === "Vendido").length / bienes.length) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs text-slate-400 font-bold block">DISPONIBLES</span>
                        <span className="text-xl font-black text-slate-700">
                          {bienes.filter((b) => b.disponibilidad === "Disponible").length} activos
                        </span>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs text-slate-400 font-bold block">VENDIDOS</span>
                        <span className="text-xl font-black text-slate-700">
                          {bienes.filter((b) => b.disponibilidad === "Vendido").length} activos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit & Consolidation Summary */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">Resumen Consolidador del Proceso</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-sm font-medium text-slate-600">Total Bienes Registrados</span>
                      <span className="text-sm font-bold text-slate-800">{bienes.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-sm font-medium text-slate-600">Existencia Física Verificada</span>
                      <span className="text-sm font-bold text-slate-800">
                        {bienes.filter((b) => b.existenciaFisica).length} / {bienes.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-sm font-medium text-slate-600">Cuentas Contables en Balance</span>
                      <span className="text-sm font-bold text-slate-800">{INITIAL_BALANCES.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BIENES REALIZABLES (CRUD) */}
          {activeTab === "bienes" && (
            <div className="space-y-8 animate-fadeIn">
              {showAddBien || editingBien ? (
                <div>
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setShowAddBien(false);
                        setEditingBien(null);
                      }}
                      className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      ← Volver a la Lista
                    </button>
                  </div>
                  <BienForm
                    initialData={editingBien || undefined}
                    onSubmit={editingBien ? handleEditBien : handleAddBien}
                    onCancel={() => {
                      setShowAddBien(false);
                      setEditingBien(null);
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Gestión de Bienes Realizables</h2>
                      <p className="text-sm text-slate-500 mt-1">Registrar, modificar y eliminar activos transaccionales.</p>
                    </div>
                    <button
                      onClick={() => setShowAddBien(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm"
                    >
                      + Registrar Bien
                    </button>
                  </div>

                  {/* Bienes Table */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold tracking-wider border-b border-slate-200/60">
                          <tr>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4">ID / Placa</th>
                            <th className="px-6 py-4">Descripción</th>
                            <th className="px-6 py-4">Cantón</th>
                            <th className="px-6 py-4 text-right">Saldo Libros ($)</th>
                            <th className="px-6 py-4 text-right">Valor Avalúo ($)</th>
                            <th className="px-6 py-4 text-center">Físico</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bienes.map((bien) => (
                            <tr key={bien.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-900">{bien.tipoBien}</td>
                              <td className="px-6 py-4 text-xs font-mono text-slate-500">{bien.numeroIdentificacion}</td>
                              <td className="px-6 py-4 max-w-xs truncate text-slate-600">{bien.descripcion}</td>
                              <td className="px-6 py-4 text-slate-500">{bien.ubicacionCanton}</td>
                              <td className="px-6 py-4 text-right font-medium text-slate-800">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                                  bien.saldoLibros
                                )}
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                                  bien.valorAvaluo
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {bien.existenciaFisica ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/40">
                                    Sí
                                  </span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/40">
                                    No
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setEditingBien(bien)}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                                    title="Editar"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => bien.id && handleDeleteBien(bien.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                    title="Eliminar"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BALANCES (SOLO LECTURA) */}
          {activeTab === "balances" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/80 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Balances y Contabilidad</h2>
                <p className="text-sm text-slate-500 mt-1">Registros cargados desde el balance de corte oficial de la cooperativa.</p>
              </div>
              <ReadOnlyBalanceTable balances={INITIAL_BALANCES} />
            </div>
          )}

          {/* TAB 4: CARGAR EXCEL DE EJEMPLO */}
          {activeTab === "upload" && (
            <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
              <div className="border-b border-slate-200/80 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Cargar Archivo Excel de Ejemplo</h2>
                <p className="text-sm text-slate-500 mt-1">Sube un archivo .xlsx o .xlsm para simular la importación de bienes y balances en el sistema.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".xlsx,.xlsm"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadFile(file);
                        setUploadSuccess(false);
                      }
                    }}
                  />
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <svg className="w-6 h-6 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Arrastra tu archivo aquí o haz clic para explorar</p>
                      <p className="text-xs text-slate-400 mt-1">Soporta formatos de Excel (.xlsx, .xlsm)</p>
                    </div>
                  </div>
                </div>

                {uploadFile && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{uploadFile.name}</p>
                        <p className="text-xs text-slate-400">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    disabled={!uploadFile || isUploading}
                    onClick={() => {
                      setIsUploading(true);
                      setTimeout(() => {
                        setIsUploading(false);
                        setUploadSuccess(true);
                        // Inject 2 new simulated assets to show integration
                        setBienes((prev) => [
                          ...prev,
                          {
                            id: prev.length + 1,
                            tipoBien: "Inmueble",
                            descripcion: "Terreno Sector Industrial - Lote Importado por Excel",
                            existenciaFisica: true,
                            numeroIdentificacion: "EXCEL-LOT-99",
                            ubicacionCanton: "Manta",
                            saldoLibros: 120000,
                            valorAvaluo: 145000,
                            disponibilidad: "Disponible",
                          },
                          {
                            id: prev.length + 2,
                            tipoBien: "Equipos de Computación",
                            descripcion: "Servidores HP ProLiant Gen10",
                            existenciaFisica: true,
                            numeroIdentificacion: "EXCEL-HP-88",
                            ubicacionCanton: "Quito",
                            saldoLibros: 15400,
                            valorAvaluo: 14000,
                            disponibilidad: "Vendido",
                            fechaVenta: "2026-07-10",
                            valorVenta: 14500,
                            compradorId: "1790088776001",
                            razonSocialComprador: "Tecnologías Globales Cía. Ltda.",
                          }
                        ]);
                        setUploadFile(null);
                      }, 2000);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isUploading ? "Procesando Archivo..." : "Importar Datos de Ejemplo"}
                  </button>
                </div>

                {uploadSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-semibold">
                      ¡Excel importado correctamente! Se han cargado 2 nuevos bienes realizables y se actualizaron los indicadores del Dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
