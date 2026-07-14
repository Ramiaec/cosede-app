"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import BienForm, { BienData } from "../../components/forms/BienForm";
import ReadOnlyBalanceTable, { BalanceItem } from "../../components/ui/ReadOnlyBalanceTable";
import InicioForm, { InicioData } from "../../components/forms/InicioForm";
import DepositoForm, { DepositoData } from "../../components/forms/DepositoForm";
import CarteraForm, { CarteraData } from "../../components/forms/CarteraForm";

// Initial Mock Assets (BIENES)
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

// Initial Mock Depositors (DEPOSITOS)
const INITIAL_DEPOSITOS: DepositoData[] = [
  {
    id: 1,
    numeroRegistro: 1,
    tipoPersona: "Natural",
    validadorId: "VALIDO",
    tipoIdAcreedor: "C",
    idAcreedor: "1718293847",
    nombreAcreedor: "Morales Bastidas Alexandra María",
    agenciaCanton: "Quito",
    vinculado: "NO",
    tipoVinculado: "",
    saldoTotal: 2540.50,
  },
  {
    id: 2,
    numeroRegistro: 2,
    tipoPersona: "Natural",
    validadorId: "VALIDO",
    tipoIdAcreedor: "C",
    idAcreedor: "0928374615",
    nombreAcreedor: "Castillo Torres Christian Fernando",
    agenciaCanton: "Guayaquil",
    vinculado: "SI",
    tipoVinculado: "Vocal del Consejo de Administración",
    saldoTotal: 15400.00,
  },
  {
    id: 3,
    numeroRegistro: 3,
    tipoPersona: "Jurídica",
    validadorId: "VALIDO",
    tipoIdAcreedor: "R",
    idAcreedor: "1792837465001",
    nombreAcreedor: "Comercializadora del Pacífico Cía. Ltda.",
    agenciaCanton: "Manta",
    vinculado: "NO",
    tipoVinculado: "",
    saldoTotal: 45890.00,
  },
];

// Initial Mock Credits (CARTERA Y JUICIOS)
const INITIAL_CARTERA: CarteraData[] = [
  {
    id: 1,
    codigoSocio: "SOC-001",
    tipoIdSocio: "C",
    validadorIdSocio: "VALIDO",
    numeroOperacion: "CR-00109",
    idCliente: "1728394857",
    relacion: "DEUDOR",
    nombreSocio: "Alvear Carrera Diego Francisco",
    estadoCivil: "CASADO(A)",
    saldoFecha: 8430.00,
  },
  {
    id: 2,
    codigoSocio: "SOC-002",
    tipoIdSocio: "C",
    validadorIdSocio: "VALIDO",
    numeroOperacion: "CR-00115",
    idCliente: "0918273645",
    relacion: "DEUDOR",
    nombreSocio: "Gómez Jurado María Elena",
    estadoCivil: "SOLTERO(A)",
    saldoFecha: 12500.00,
  },
];

// Initial Mock Balances (BALANCES)
const INITIAL_BALANCES: BalanceItem[] = [
  { id: 1, nivel: 1, codigoCuenta: "1", nombreCuenta: "ACTIVO", saldoMes: 1250430.22, fechaRegistro: "2026-06-30" },
  { id: 2, nivel: 2, codigoCuenta: "11", nombreCuenta: "FONDOS DISPONIBLES", saldoMes: 345120.15, fechaRegistro: "2026-06-30" },
  { id: 3, nivel: 4, codigoCuenta: "1101", nombreCuenta: "Caja", saldoMes: 4500.00, fechaRegistro: "2026-06-30" },
  { id: 4, nivel: 6, codigoCuenta: "110105", nombreCuenta: "Efectivo", saldoMes: 4500.00, fechaRegistro: "2026-06-30" },
  { id: 5, nivel: 2, codigoCuenta: "12", nombreCuenta: "OPERACIONES DE CRÉDITO", saldoMes: 685310.07, fechaRegistro: "2026-06-30" },
  { id: 6, nivel: 2, codigoCuenta: "14", nombreCuenta: "BIENES REALIZABLES", saldoMes: 220000.00, fechaRegistro: "2026-06-30" },
];

type TabType = "inicio" | "dashboard" | "depositos" | "cartera" | "bienes" | "balances" | "upload";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [bienes, setBienes] = useState<BienData[]>(INITIAL_BIENES);
  const [depositos, setDepositos] = useState<DepositoData[]>(INITIAL_DEPOSITOS);
  const [cartera, setCartera] = useState<CarteraData[]>(INITIAL_CARTERA);

  // Dynamic state for general configurations (INICIO) which inherits from user session
  const [inicioData, setInicioData] = useState<InicioData>({
    rucCooperativa: "",
    razonSocial: "",
    tipoIdLiquidador: "R",
    idLiquidador: "",
    nombreLiquidador: "",
    tipoLiquidacion: "Forzosa",
    aplicaSeguro: "SI",
    fechaLineaBase: "2019-12-31",
    fechaCorte: "2026-06-30",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    } else if (user) {
      setInicioData({
        rucCooperativa: user.ruc,
        razonSocial: user.razonSocial,
        tipoIdLiquidador: "R",
        idLiquidador: user.ruc,
        nombreLiquidador: user.liquidador,
        tipoLiquidacion: user.estadoLiquidacion,
        aplicaSeguro: "SI",
        fechaLineaBase: "2019-12-31",
        fechaCorte: user.fechaResolucion ? user.fechaResolucion.split("T")[0] : "2026-06-30",
      });
    }
  }, [user, authLoading, router]);

  // Bienes states
  const [showAddBien, setShowAddBien] = useState(false);
  const [editingBien, setEditingBien] = useState<BienData | null>(null);

  // Depositos states
  const [showAddDeposito, setShowAddDeposito] = useState(false);
  const [editingDeposito, setEditingDeposito] = useState<DepositoData | null>(null);

  // Cartera states
  const [showAddCartera, setShowAddCartera] = useState(false);
  const [editingCartera, setEditingCartera] = useState<CarteraData | null>(null);

  // Excel states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Financial calculations in Real Time
  const totalBienesLibros = bienes.reduce((acc, curr) => acc + curr.saldoLibros, 0);
  const totalBienesAvaluo = bienes.reduce((acc, curr) => acc + curr.valorAvaluo, 0);
  const totalBienesVendidos = bienes
    .filter((b) => b.disponibilidad === "Vendido")
    .reduce((acc, curr) => acc + (curr.valorVenta || 0), 0);

  const totalDepositosSaldos = depositos.reduce((acc, curr) => acc + curr.saldoTotal, 0);
  const totalCarteraSaldos = cartera.reduce((acc, curr) => acc + curr.saldoFecha, 0);

  // Bien CRUD
  const handleAddBien = (newBien: BienData) => {
    setBienes((prev) => [...prev, { ...newBien, id: prev.length + 1 }]);
    setShowAddBien(false);
  };
  const handleEditBien = (updatedBien: BienData) => {
    setBienes((prev) => prev.map((b) => (b.id === editingBien?.id ? { ...updatedBien, id: b.id } : b)));
    setEditingBien(null);
  };
  const handleDeleteBien = (id: number) => {
    if (confirm("¿Está seguro de eliminar este registro de bien realizable?")) {
      setBienes((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Deposito CRUD
  const handleAddDeposito = (newDep: DepositoData) => {
    setDepositos((prev) => [...prev, { ...newDep, id: prev.length + 1 }]);
    setShowAddDeposito(false);
  };
  const handleEditDeposito = (updatedDep: DepositoData) => {
    setDepositos((prev) => prev.map((d) => (d.id === editingDeposito?.id ? { ...updatedDep, id: d.id } : d)));
    setEditingDeposito(null);
  };
  const handleDeleteDeposito = (id: number) => {
    if (confirm("¿Está seguro de eliminar este registro de depósito?")) {
      setDepositos((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // Cartera CRUD
  const handleAddCartera = (newCart: CarteraData) => {
    setCartera((prev) => [...prev, { ...newCart, id: prev.length + 1 }]);
    setShowAddCartera(false);
  };
  const handleEditCartera = (updatedCart: CarteraData) => {
    setCartera((prev) => prev.map((c) => (c.id === editingCartera?.id ? { ...updatedCart, id: c.id } : c)));
    setEditingCartera(null);
  };
  const handleDeleteCartera = (id: number) => {
    if (confirm("¿Está seguro de eliminar esta operación de cartera?")) {
      setCartera((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleInicioSubmit = (data: InicioData) => {
    setInicioData(data);
    alert("Datos de INICIO guardados y modificados en el estado de sesión actual.");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-66 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none tracking-tight">COSEDE APP</h1>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Multi-cooperativa</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {/* INICIO */}
          <button
            onClick={() => setActiveTab("inicio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
              activeTab === "inicio" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            1. Inicio / Config
          </button>

          {/* DASHBOARD */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
              activeTab === "dashboard" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            2. Dashboard (REPORTE)
          </button>

          {/* DEPOSITOS */}
          <button
            onClick={() => setActiveTab("depositos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
              activeTab === "depositos" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            3. Depósitos
          </button>

          {/* CARTERA */}
          <button
            onClick={() => setActiveTab("cartera")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
              activeTab === "cartera" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            4. Cartera
          </button>

          {/* BIENES */}
          <button
            onClick={() => setActiveTab("bienes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
              activeTab === "bienes" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 114 0v2m-4 0h4m-2 3v2m0 1v3m0 0h.01" />
            </svg>
            5. Bienes
          </button>

          {/* BALANCES */}
          <button
            onClick={() => setActiveTab("balances")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
              activeTab === "balances" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            6. Balances
          </button>

          {/* EXCEL UPLOAD */}
          <button
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
              activeTab === "upload" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            7. Importar Excel
          </button>
        </nav>

        {/* User profile info & Logout */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-3 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-white border border-slate-700/50 text-xs">
              COOP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-none text-slate-200 truncate">{inicioData.nombreLiquidador.split(" ")[0] || "Liquidador"}</p>
              <span className="text-[10px] text-slate-500 font-mono truncate block">RUC: {inicioData.rucCooperativa}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-red-950/20 hover:border-red-900/40 text-xs font-bold uppercase tracking-wider transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-150 px-8 flex items-center justify-between shadow-sm sticky top-0 z-40 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/50">
              {inicioData.razonSocial}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Fecha Corte Operativo</p>
            <p className="text-sm font-bold text-slate-700">{inicioData.fechaCorte}</p>
          </div>
        </header>

        {/* Page Content wrapper */}
        <div className="p-8 max-w-7xl w-full mx-auto flex-1 space-y-8">
          {/* TAB: INICIO */}
          {activeTab === "inicio" && (
            <div className="space-y-6 animate-fadeIn">
              <InicioForm initialData={inicioData} onSubmit={handleInicioSubmit} />
            </div>
          )}

          {/* TAB: DASHBOARD / REPORTE */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reporte Consolidado de Liquidación</h2>
                  <p className="text-slate-500 mt-1">Valores consolidados automáticamente de todos los módulos.</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-all text-sm font-bold"
                >
                  Exportar Reporte (PDF)
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Activos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activos en Libros</h4>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(INITIAL_BALANCES[0].saldoMes)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Balance contable consolidado</p>
                </div>

                {/* Total Bienes Avaluo */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avalúo de Bienes</h4>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBienesAvaluo)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-blue-600 font-semibold">{bienes.length} bienes registrados</p>
                </div>

                {/* Total Depositos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Depósitos</h4>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalDepositosSaldos)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-600 font-semibold">{depositos.length} acreedores registrados</p>
                </div>

                {/* Total Cartera */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo de Cartera</h4>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-slate-900">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalCarteraSaldos)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-purple-600 font-semibold">{cartera.length} socios deudores</p>
                </div>
              </div>

              {/* Data Visualization Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Real-time recovery simulation */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">Realización de Bienes Realizables</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                        <span>Bienes Vendidos (Ingreso Neto)</span>
                        <span>
                          {bienes.length > 0
                            ? Math.round((bienes.filter((b) => b.disponibilidad === "Vendido").length / bienes.length) * 100)
                            : 0}
                          % del total
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              bienes.length > 0
                                ? (bienes.filter((b) => b.disponibilidad === "Vendido").length / bienes.length) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-bold block">VALOR EN VENTAS</span>
                        <span className="text-lg font-black text-slate-700">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBienesVendidos)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-bold block">BIENES RESTANTES</span>
                        <span className="text-lg font-black text-slate-700">
                          {bienes.filter((b) => b.disponibilidad !== "Vendido").length} activos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit & Consolidation Summary */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">Resumen y Cobertura de Seguro</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Acreedores Vinculados</span>
                      <span className="text-sm font-bold text-red-600">
                        {depositos.filter((d) => d.vinculado === "SI").length} (Excluidos de COSEDE)
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Acreedores Validados (Válidos)</span>
                      <span className="text-sm font-bold text-emerald-600">
                        {depositos.filter((d) => d.validadorId === "VALIDO").length} de {depositos.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Estado de Liquidación</span>
                      <span className="text-sm font-semibold text-slate-700">{inicioData.tipoLiquidacion}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEPOSITOS (CRUD) */}
          {activeTab === "depositos" && (
            <div className="space-y-6 animate-fadeIn">
              {showAddDeposito || editingDeposito ? (
                <div>
                  <button
                    onClick={() => { setShowAddDeposito(false); setEditingDeposito(null); }}
                    className="mb-4 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    ← Volver a la Lista
                  </button>
                  <DepositoForm
                    initialData={editingDeposito || undefined}
                    onSubmit={editingDeposito ? handleEditDeposito : handleAddDeposito}
                    onCancel={() => { setShowAddDeposito(false); setEditingDeposito(null); }}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Gestión de Depósitos (Acreedores)</h2>
                      <p className="text-sm text-slate-500 mt-1">Registrar y mantener la base de datos de socios depositantes.</p>
                    </div>
                    <button
                      onClick={() => setShowAddDeposito(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all text-sm"
                    >
                      + Registrar Acreedor
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4">No.</th>
                            <th className="px-6 py-4">Identificación</th>
                            <th className="px-6 py-4">Acreedor</th>
                            <th className="px-6 py-4">Cantón</th>
                            <th className="px-6 py-4 text-center">Vinculado</th>
                            <th className="px-6 py-4 text-right">Saldo Total ($)</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {depositos.map((dep) => (
                            <tr key={dep.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-mono text-xs">{dep.numeroRegistro}</td>
                              <td className="px-6 py-4 font-mono text-xs text-slate-500">{dep.idAcreedor || "N/A"}</td>
                              <td className="px-6 py-4 font-semibold text-slate-900">{dep.nombreAcreedor}</td>
                              <td className="px-6 py-4 text-slate-500">{dep.agenciaCanton}</td>
                              <td className="px-6 py-4 text-center">
                                {dep.vinculado === "SI" ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">SÍ</span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">NO</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(dep.saldoTotal)}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button onClick={() => setEditingDeposito(dep)} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                                    Editar
                                  </button>
                                  <button onClick={() => dep.id && handleDeleteDeposito(dep.id)} className="p-1 hover:bg-red-50 rounded text-red-600">
                                    Eliminar
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

          {/* TAB: CARTERA (CRUD) */}
          {activeTab === "cartera" && (
            <div className="space-y-6 animate-fadeIn">
              {showAddCartera || editingCartera ? (
                <div>
                  <button
                    onClick={() => { setShowAddCartera(false); setEditingCartera(null); }}
                    className="mb-4 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    ← Volver a la Lista
                  </button>
                  <CarteraForm
                    initialData={editingCartera || undefined}
                    onSubmit={editingCartera ? handleEditCartera : handleAddCartera}
                    onCancel={() => { setShowAddCartera(false); setEditingCartera(null); }}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Gestión de Cartera y Juicios de Crédito</h2>
                      <p className="text-sm text-slate-500 mt-1">Registrar socios deudores, garantes y saldos por cobrar.</p>
                    </div>
                    <button
                      onClick={() => setShowAddCartera(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all text-sm"
                    >
                      + Registrar Socio/Operación
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4">Código Socio</th>
                            <th className="px-6 py-4">Identificación</th>
                            <th className="px-6 py-4">Socio / Deudor</th>
                            <th className="px-6 py-4">Operación</th>
                            <th className="px-6 py-4">Relación</th>
                            <th className="px-6 py-4 text-right">Saldo ($)</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cartera.map((cart) => (
                            <tr key={cart.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-mono text-xs">{cart.codigoSocio}</td>
                              <td className="px-6 py-4 font-mono text-xs text-slate-500">{cart.idCliente}</td>
                              <td className="px-6 py-4 font-semibold text-slate-900">{cart.nombreSocio}</td>
                              <td className="px-6 py-4 font-mono text-xs">{cart.numeroOperacion}</td>
                              <td className="px-6 py-4 text-xs font-bold text-slate-500">{cart.relacion}</td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cart.saldoFecha)}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button onClick={() => setEditingCartera(cart)} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                                    Editar
                                  </button>
                                  <button onClick={() => cart.id && handleDeleteCartera(cart.id)} className="p-1 hover:bg-red-50 rounded text-red-600">
                                    Eliminar
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

          {/* TAB: BIENES (CRUD) */}
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
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all text-sm"
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
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bien.saldoLibros)}
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bien.valorAvaluo)}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {bien.existenciaFisica ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/40">Sí</span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/40">No</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => setEditingBien(bien)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
                                    Editar
                                  </button>
                                  <button onClick={() => bien.id && handleDeleteBien(bien.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                                    Eliminar
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

          {/* TAB: BALANCES (SOLO LECTURA) */}
          {activeTab === "balances" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/80 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Balances y Contabilidad</h2>
                <p className="text-sm text-slate-500 mt-1">Registros cargados desde el balance de corte oficial de la cooperativa.</p>
              </div>
              <ReadOnlyBalanceTable balances={INITIAL_BALANCES} />
            </div>
          )}

          {/* TAB: UPLOAD EXCEL */}
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
                    <button onClick={() => setUploadFile(null)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remover</button>
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
                        ]);
                        setUploadFile(null);
                      }, 2000);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
                  >
                    {isUploading ? "Procesando Archivo..." : "Importar Datos de Ejemplo"}
                  </button>
                </div>

                {uploadSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
                    <p className="text-sm font-semibold">¡Excel importado correctamente! Se actualizaron los indicadores del Dashboard.</p>
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
