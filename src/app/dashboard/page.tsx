"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import BienForm, { BienData } from "../../components/forms/BienForm";
import ReadOnlyBalanceTable, { BalanceItem } from "../../components/ui/ReadOnlyBalanceTable";
import InicioForm, { InicioData } from "../../components/forms/InicioForm";
import DepositoForm, { DepositoData } from "../../components/forms/DepositoForm";
import CarteraForm, { CarteraData } from "../../components/forms/CarteraForm";
import * as XLSX from "xlsx";

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
    gap: "NO",
    tipoGap: "",
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
    gap: "NO",
    tipoGap: "",
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
    gap: "SI",
    tipoGap: "1.- Personas adultas mayores",
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
  { id: 1, nivel: 1, codigoCuenta: "1", nombreCuenta: "ACTIVO", saldoInicial: 1250430.22, saldosMensuales: [], fechaRegistro: "2026-06-30" },
  { id: 2, nivel: 2, codigoCuenta: "11", nombreCuenta: "FONDOS DISPONIBLES", saldoInicial: 345120.15, saldosMensuales: [], fechaRegistro: "2026-06-30" },
  { id: 3, nivel: 4, codigoCuenta: "1101", nombreCuenta: "Caja", saldoInicial: 4500.00, saldosMensuales: [], fechaRegistro: "2026-06-30" },
  { id: 4, nivel: 6, codigoCuenta: "110105", nombreCuenta: "Efectivo", saldoInicial: 4500.00, saldosMensuales: [], fechaRegistro: "2026-06-30" },
  { id: 5, nivel: 2, codigoCuenta: "12", nombreCuenta: "OPERACIONES DE CRÉDITO", saldoInicial: 685310.07, saldosMensuales: [], fechaRegistro: "2026-06-30" },
  { id: 6, nivel: 2, codigoCuenta: "14", nombreCuenta: "BIENES REALIZABLES", saldoInicial: 220000.00, saldosMensuales: [], fechaRegistro: "2026-06-30" },
];

type TabType = "inicio" | "dashboard" | "depositos" | "cartera" | "bienes" | "balances" | "upload";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [bienes, setBienes] = useState<BienData[]>(INITIAL_BIENES);
  const [depositos, setDepositos] = useState<DepositoData[]>(INITIAL_DEPOSITOS);
  const [cartera, setCartera] = useState<CarteraData[]>(INITIAL_CARTERA);
  const [balances, setBalances] = useState<BalanceItem[]>(INITIAL_BALANCES);

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

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBienes = localStorage.getItem("cosede_bienes");
      if (savedBienes) setBienes(JSON.parse(savedBienes));

      const savedDepositos = localStorage.getItem("cosede_depositos");
      if (savedDepositos) setDepositos(JSON.parse(savedDepositos));

      const savedCartera = localStorage.getItem("cosede_cartera");
      if (savedCartera) setCartera(JSON.parse(savedCartera));

      const savedBalances = localStorage.getItem("cosede_balances");
      if (savedBalances) setBalances(JSON.parse(savedBalances));

      const savedInicio = localStorage.getItem("cosede_inicio_data");
      if (savedInicio) setInicioData(JSON.parse(savedInicio));
    }
  }, []);

  // Save changes to localStorage on state modifications
  useEffect(() => {
    if (bienes.length > 0) {
      localStorage.setItem("cosede_bienes", JSON.stringify(bienes));
    }
  }, [bienes]);

  useEffect(() => {
    if (depositos.length > 0) {
      localStorage.setItem("cosede_depositos", JSON.stringify(depositos));
    }
  }, [depositos]);

  useEffect(() => {
    if (cartera.length > 0) {
      localStorage.setItem("cosede_cartera", JSON.stringify(cartera));
    }
  }, [cartera]);

  useEffect(() => {
    if (balances.length > 0) {
      localStorage.setItem("cosede_balances", JSON.stringify(balances));
    }
  }, [balances]);

  useEffect(() => {
    if (inicioData.rucCooperativa !== "") {
      localStorage.setItem("cosede_inicio_data", JSON.stringify(inicioData));
    }
  }, [inicioData]);

  // Bienes states
  const [showAddBien, setShowAddBien] = useState(false);
  const [editingBien, setEditingBien] = useState<BienData | null>(null);

  // Depositos states
  const [showAddDeposito, setShowAddDeposito] = useState(false);
  const [editingDeposito, setEditingDeposito] = useState<DepositoData | null>(null);
  const [searchTermDepositos, setSearchTermDepositos] = useState("");

  // Cartera states
  const [showAddCartera, setShowAddCartera] = useState(false);
  const [editingCartera, setEditingCartera] = useState<CarteraData | null>(null);

  // Excel states per category
  const [fileBienes, setFileBienes] = useState<File | null>(null);
  const [fileBalances, setFileBalances] = useState<File | null>(null);
  const [fileDepositos, setFileDepositos] = useState<File | null>(null);
  const [fileCartera, setFileCartera] = useState<File | null>(null);

  const [loadingBienes, setLoadingBienes] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [loadingDepositos, setLoadingDepositos] = useState(false);
  const [loadingCartera, setLoadingCartera] = useState(false);

  const [successBienes, setSuccessBienes] = useState(false);
  const [successBalances, setSuccessBalances] = useState(false);
  const [successDepositos, setSuccessDepositos] = useState(false);
  const [successCartera, setSuccessCartera] = useState(false);

  const [nuevoBalanceFecha, setNuevoBalanceFecha] = useState("");
  const [nuevoBalanceFile, setNuevoBalanceFile] = useState<File | null>(null);
  const [loadingNuevoBalance, setLoadingNuevoBalance] = useState(false);
  const [successNuevoBalance, setSuccessNuevoBalance] = useState(false);

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
  
  // Total Activos from dynamic balances
  const totalActivosLibros = balances.find((b) => b.codigoCuenta === "1")?.saldoInicial || 0;

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

  // Excel parsing functions
  const handleUploadBienes = () => {
    if (!fileBienes) return;
    setLoadingBienes(true);
    setSuccessBienes(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const mapped = rows.map((r: any, idx: number) => ({
          id: idx + 1,
          tipoBien: r["TIPO DE BIEN"] || "Otro",
          descripcion: r["DESCRIPCION DEL BIEN"] || "",
          existenciaFisica: String(r["EXISTENCIA FISICA"]).toUpperCase() === "SI" || String(r["EXISTENCIA FISICA"]).toUpperCase() === "SÍ",
          numeroIdentificacion: String(r["Nº DE IDENTIFICACION DEL BIEN"] || r["N_ DE IDENTIFICACION DEL BIEN"] || ""),
          ubicacionCanton: r["UBICACION ACTUAL DEL BIEN (CANTÓN)"] || r["UBICACION ACTUAL DEL BIEN (CANTON)"] || "",
          saldoLibros: parseFloat(r["SALDO EN LIBROS"]) || 0,
          valorAvaluo: parseFloat(r["VALOR AVALUO PERITO"]) || 0,
          disponibilidad: r["DISPONIBILIDAD DEL BIEN"] || "Disponible",
        }));

        setBienes(mapped);
        setSuccessBienes(true);
        setFileBienes(null);
      } catch (err) {
        alert("Error al parsear la plantilla de BIENES. Verifique el formato.");
      } finally {
        setLoadingBienes(false);
      }
    };
    reader.readAsArrayBuffer(fileBienes);
  };

  const handleUploadBalances = () => {
    if (!fileBalances) return;
    setLoadingBalances(true);
    setSuccessBalances(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // Use { range: 1 } to skip Row 1 (the 'DATOS GENERALES' / 'FECHA DE CORTE' title row)
        // so that Row 2 (the headers row) becomes the headers for JSON mapping!
        const rows = XLSX.utils.sheet_to_json(sheet, { range: 1, defval: "" });

        const mapped = rows.map((r: any, idx: number) => {
          const rawCodigo = r["CODIGO"] !== undefined ? r["CODIGO"] : (r["CODIGO CUENTA"] || r["CODIGO_CUENTA"] || "");
          const rawCuenta = r["CUENTA"] !== undefined ? r["CUENTA"] : (r["NOMBRE CUENTA"] || r["NOMBRE_CUENTA"] || "");
          const rawSaldo = r["mes 1"] !== undefined ? r["mes 1"] : (r["MES 1"] || r["SALDO MES"] || r["SALDO_MES"] || r["SALDO"] || 0);

          return {
            id: idx + 1,
            nivel: parseInt(r["NIVEL"]) || 1,
            codigoCuenta: String(rawCodigo),
            nombreCuenta: String(rawCuenta),
            saldoInicial: parseFloat(rawSaldo) || 0,
            saldosMensuales: [],
            fechaRegistro: String(r["FECHA REGISTRO"] || r["FECHA_REGISTRO"] || "2026-06-30"),
          };
        });

        setBalances(mapped);
        setSuccessBalances(true);
        setFileBalances(null);
      } catch (err) {
        alert("Error al parsear la plantilla de BALANCES. Verifique el formato.");
      } finally {
        setLoadingBalances(false);
      }
    };
    reader.readAsArrayBuffer(fileBalances);
  };

  const handleUploadNuevoBalance = () => {
    if (!nuevoBalanceFile || !nuevoBalanceFecha) {
      alert("Por favor seleccione un archivo y una fecha de corte (Mes y Año).");
      return;
    }
    setLoadingNuevoBalance(true);
    setSuccessNuevoBalance(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { range: 1, defval: "" });

        const mappedRows = rows.map((r: any) => {
          const rawCodigo = r["CODIGO"] !== undefined ? r["CODIGO"] : (r["CODIGO CUENTA"] || r["CODIGO_CUENTA"] || "");
          const rawSaldo = r["mes 1"] !== undefined ? r["mes 1"] : (r["MES 1"] || r["SALDO MES"] || r["SALDO_MES"] || r["SALDO"] || 0);
          return { codigoCuenta: String(rawCodigo), valor: parseFloat(rawSaldo) || 0 };
        });

        setBalances((prevBalances) =>
          prevBalances.map((bal) => {
            const foundRow = mappedRows.find((mr) => mr.codigoCuenta === bal.codigoCuenta);
            const newValor = foundRow ? foundRow.valor : 0;
            
            const existingIndex = bal.saldosMensuales?.findIndex((sm) => sm.fecha === nuevoBalanceFecha);
            const updatedSaldos = [...(bal.saldosMensuales || [])];
            
            if (existingIndex !== undefined && existingIndex >= 0) {
              updatedSaldos[existingIndex] = { fecha: nuevoBalanceFecha, valor: newValor };
            } else {
              updatedSaldos.push({ fecha: nuevoBalanceFecha, valor: newValor });
            }
            
            updatedSaldos.sort((a, b) => a.fecha.localeCompare(b.fecha));
            
            return {
              ...bal,
              saldosMensuales: updatedSaldos,
            };
          })
        );
        
        setSuccessNuevoBalance(true);
        setNuevoBalanceFile(null);
      } catch (err) {
        alert("Error al parsear el nuevo balance. Verifique el formato.");
      } finally {
        setLoadingNuevoBalance(false);
      }
    };
    reader.readAsArrayBuffer(nuevoBalanceFile);
  };

  const handleUploadDepositos = () => {
    if (!fileDepositos) return;
    setLoadingDepositos(true);
    setSuccessDepositos(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const mapped = rows.map((r: any, idx: number) => ({
          id: idx + 1,
          numeroRegistro: parseInt(r["No."]) || idx + 1,
          tipoPersona: r["TIPO PERSONA"] || "Natural",
          validadorId: r["VALIDADOR ID DEPOSITANTE ACREEDOR"] || "VALIDO",
          tipoIdAcreedor: r["TIPO ID DEPOSITANTE ACREEDOR"] || "C",
          idAcreedor: String(r["ID DEPOSITANTE ACREEDOR"] || ""),
          nombreAcreedor: r["APELLIDOS Y NOMBRES ACREEDOR"] || "",
          agenciaCanton: r["AGENCIA COAC EN LIQUIDACION (CANTON)"] || "",
          vinculado: r["VINCULADO"] || "NO",
          tipoVinculado: r["TIPO VINCULADO"] || "",
          gap: r["GAP"] || "NO",
          tipoGap: r["TIPO GAP"] || "",
          saldoTotal: parseFloat(r["SALDO TOTAL"]) || 0,
        }));

        setDepositos(mapped);
        setSuccessDepositos(true);
        setFileDepositos(null);
      } catch (err) {
        alert("Error al parsear la plantilla de DEPOSITOS. Verifique el formato.");
      } finally {
        setLoadingDepositos(false);
      }
    };
    reader.readAsArrayBuffer(fileDepositos);
  };

  const handleUploadCartera = () => {
    if (!fileCartera) return;
    setLoadingCartera(true);
    setSuccessCartera(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const mapped = rows.map((r: any, idx: number) => ({
          id: idx + 1,
          codigoSocio: r["CODIGO SOCIO"] || "",
          tipoIdSocio: r["TIPO ID SOCIO"] || "C",
          validadorIdSocio: r["VALIDADOR ID SOCIO"] || "VALIDO",
          numeroOperacion: r["NUMERO DE OPERACION"] || "",
          idCliente: String(r["ID CLIENTE"] || ""),
          relacion: r["RELACION"] || "DEUDOR",
          nombreSocio: r["APELLIDOS Y NOMBRES SOCIO"] || "",
          estadoCivil: r["ESTADO CIVIL"] || "SOLTERO(A)",
          saldoFecha: parseFloat(r["SALDO CARTERA"]) || 0,
        }));

        setCartera(mapped);
        setSuccessCartera(true);
        setFileCartera(null);
      } catch (err) {
        alert("Error al parsear la plantilla de CARTERA. Verifique el formato.");
      } finally {
        setLoadingCartera(false);
      }
    };
    reader.readAsArrayBuffer(fileCartera);
  };

  const handleClearAll = () => {
    if (confirm("¿Está seguro de que desea limpiar todas las bases de datos (Bienes, Depósitos, Cartera, Balances)? Se borrarán todos los registros cargados de forma permanente.")) {
      setBienes([]);
      setDepositos([]);
      setCartera([]);
      setBalances([]);
      localStorage.removeItem("cosede_bienes");
      localStorage.removeItem("cosede_depositos");
      localStorage.removeItem("cosede_cartera");
      localStorage.removeItem("cosede_balances");
      setSuccessBienes(false);
      setSuccessBalances(false);
      setSuccessDepositos(false);
      setSuccessCartera(false);
      alert("Todas las bases de datos han sido limpiadas y reestablecidas.");
    }
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
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
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
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Auto-guardado activo
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Fecha Corte Operativo</p>
              <p className="text-sm font-bold text-slate-700">{inicioData.fechaCorte}</p>
            </div>
            <button
              onClick={() => {
                localStorage.setItem("cosede_bienes", JSON.stringify(bienes));
                localStorage.setItem("cosede_depositos", JSON.stringify(depositos));
                localStorage.setItem("cosede_cartera", JSON.stringify(cartera));
                localStorage.setItem("cosede_balances", JSON.stringify(balances));
                localStorage.setItem("cosede_inicio_data", JSON.stringify(inicioData));
                alert("✓ Cambios guardados permanentemente.");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Cambios
            </button>
            <div className="border-l border-slate-200 h-8"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm shadow-red-500/5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
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
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalActivosLibros)}
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
                    {/* Search Bar */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-end">
                      <div className="relative w-full max-w-sm">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input
                          type="text"
                          placeholder="Buscar por Acreedor o ID..."
                          value={searchTermDepositos}
                          onChange={(e) => setSearchTermDepositos(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      {depositos.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-4">No.</th>
                              <th className="px-4 py-4">Tipo Persona</th>
                              <th className="px-4 py-4">Validador ID</th>
                              <th className="px-4 py-4 text-center">Tipo ID</th>
                              <th className="px-4 py-4">ID Acreedor</th>
                              <th className="px-4 py-4">Acreedor</th>
                              <th className="px-4 py-4">Cantón Agencia</th>
                              <th className="px-4 py-4 text-center">Vinculado</th>
                              <th className="px-4 py-4">Tipo Vinculado</th>
                              <th className="px-4 py-4 text-center">GAP</th>
                              <th className="px-4 py-4">Tipo GAP</th>
                              <th className="px-4 py-4 text-right">Saldo Total ($)</th>
                              <th className="px-4 py-4 text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {depositos
                              .filter(
                                (dep) =>
                                  dep.nombreAcreedor.toLowerCase().includes(searchTermDepositos.toLowerCase()) ||
                                  (dep.idAcreedor && dep.idAcreedor.includes(searchTermDepositos))
                              )
                              .map((dep) => (
                              <tr key={dep.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-4 font-mono text-xs">{dep.numeroRegistro}</td>
                                <td className="px-4 py-4 text-xs">{dep.tipoPersona}</td>
                                <td className="px-4 py-4 text-xs font-semibold">{dep.validadorId}</td>
                                <td className="px-4 py-4 text-center font-mono text-xs">{dep.tipoIdAcreedor || "-"}</td>
                                <td className="px-4 py-4 font-mono text-xs text-slate-500">{dep.idAcreedor || "-"}</td>
                                <td className="px-4 py-4 font-semibold text-slate-900">{dep.nombreAcreedor}</td>
                                <td className="px-4 py-4 text-slate-500 text-xs">{dep.agenciaCanton}</td>
                                <td className="px-4 py-4 text-center">
                                  {dep.vinculado === "SI" ? (
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">SÍ</span>
                                  ) : (
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">NO</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-slate-500 text-xs">{dep.tipoVinculado || "-"}</td>
                                <td className="px-4 py-4 text-center">
                                  {dep.gap === "SI" ? (
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">SÍ</span>
                                  ) : (
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">NO</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-slate-500 text-xs">{dep.tipoGap || "-"}</td>
                                <td className="px-4 py-4 text-right font-bold text-slate-900">
                                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(dep.saldoTotal)}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <div className="flex justify-center gap-2 text-xs">
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
                      ) : (
                        <div className="p-8 text-center text-slate-400 font-semibold text-sm">
                          No hay registros de depósitos. Importe una base de datos o agregue uno manualmente.
                        </div>
                      )}
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
                      {cartera.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-4">Código Socio</th>
                              <th className="px-4 py-4 text-center">Tipo ID</th>
                              <th className="px-4 py-4">Validador ID</th>
                              <th className="px-4 py-4">No. Operación</th>
                              <th className="px-4 py-4">ID Cliente</th>
                              <th className="px-4 py-4">Relación</th>
                              <th className="px-4 py-4">Socio / Deudor</th>
                              <th className="px-4 py-4">Estado Civil</th>
                              <th className="px-4 py-4 text-right">Saldo Cartera ($)</th>
                              <th className="px-4 py-4 text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {cartera.map((cart) => (
                              <tr key={cart.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-4 font-mono text-xs">{cart.codigoSocio}</td>
                                <td className="px-4 py-4 text-center font-mono text-xs">{cart.tipoIdSocio}</td>
                                <td className="px-4 py-4 text-xs font-semibold">{cart.validadorIdSocio}</td>
                                <td className="px-4 py-4 font-mono text-xs">{cart.numeroOperacion}</td>
                                <td className="px-4 py-4 font-mono text-xs text-slate-500">{cart.idCliente}</td>
                                <td className="px-4 py-4 text-xs font-bold text-slate-500">{cart.relacion}</td>
                                <td className="px-4 py-4 font-semibold text-slate-900">{cart.nombreSocio}</td>
                                <td className="px-4 py-4 text-xs">{cart.estadoCivil}</td>
                                <td className="px-4 py-4 text-right font-bold text-slate-900">
                                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cart.saldoFecha)}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <div className="flex justify-center gap-2 text-xs">
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
                      ) : (
                        <div className="p-8 text-center text-slate-400 font-semibold text-sm">
                          No hay registros de cartera. Importe una base de datos o agregue uno manualmente.
                        </div>
                      )}
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
                      {bienes.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold tracking-wider border-b border-slate-200/60">
                            <tr>
                              <th className="px-4 py-4">Tipo de Bien</th>
                              <th className="px-4 py-4">Descripción</th>
                              <th className="px-4 py-4 text-center">Existencia Física</th>
                              <th className="px-4 py-4">Nº Identificación</th>
                              <th className="px-4 py-4">Ubicación (Cantón)</th>
                              <th className="px-4 py-4 text-right">Saldo en Libros ($)</th>
                              <th className="px-4 py-4 text-right">Valor Avalúo Perito ($)</th>
                              <th className="px-4 py-4 text-center">Disponibilidad</th>
                              <th className="px-4 py-4 text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {bienes.map((bien) => (
                              <tr key={bien.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-4 font-semibold text-slate-900">{bien.tipoBien}</td>
                                <td className="px-4 py-4 text-slate-600 max-w-xs truncate">{bien.descripcion}</td>
                                <td className="px-4 py-4 text-center">
                                  {bien.existenciaFisica ? (
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/40">SI</span>
                                  ) : (
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/40">NO</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-xs font-mono text-slate-500">{bien.numeroIdentificacion}</td>
                                <td className="px-4 py-4 text-slate-500 text-xs">{bien.ubicacionCanton}</td>
                                <td className="px-4 py-4 text-right font-medium text-slate-800">
                                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bien.saldoLibros)}
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-slate-900">
                                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bien.valorAvaluo)}
                                </td>
                                <td className="px-4 py-4 text-center text-xs font-bold text-slate-600">{bien.disponibilidad}</td>
                                <td className="px-4 py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 text-xs">
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
                      ) : (
                        <div className="p-8 text-center text-slate-400 font-semibold text-sm">
                          No hay registros de bienes realizables. Importe una base de datos o agregue uno manualmente.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: BALANCES (SOLO LECTURA) */}
          {activeTab === "balances" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/80 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Balances y Contabilidad</h2>
                  <p className="text-sm text-slate-500 mt-1">Registros cargados desde el balance de corte oficial de la cooperativa.</p>
                </div>
                
                {/* Add new Monthly Balance Panel */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-end gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Corte</label>
                    <input
                      type="month"
                      value={nuevoBalanceFecha}
                      onChange={(e) => setNuevoBalanceFecha(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subir Balance Mensual</label>
                    <input
                      type="file"
                      accept=".xlsx,.xlsm"
                      onChange={(e) => setNuevoBalanceFile(e.target.files?.[0] || null)}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-48"
                    />
                  </div>
                  <button
                    onClick={handleUploadNuevoBalance}
                    disabled={loadingNuevoBalance}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold active:scale-95 transition-all whitespace-nowrap disabled:opacity-50"
                  >
                    {loadingNuevoBalance ? "Cargando..." : "Agregar Mensual"}
                  </button>
                  {successNuevoBalance && <span className="text-emerald-500 text-xs font-bold">✓</span>}
                </div>
              </div>
              {balances.length > 0 ? (
                <ReadOnlyBalanceTable balances={balances} cooperativaName={inicioData.razonSocial} />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 font-semibold text-sm shadow-sm">
                  No hay registros de balances contables. Cargue una plantilla de balances en la opción de Importar Excel.
                </div>
              )}
            </div>
          )}

          {/* TAB: UPLOAD EXCEL */}
          {activeTab === "upload" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-200/80 pb-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Importación e Inicialización de Bases de Datos</h2>
                <p className="text-sm text-slate-500 mt-1">Cargue los archivos de Excel correspondientes a cada módulo para poblar la base de datos.</p>
              </div>

              {/* Grid 2x2 for uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. DEPOSITOS CARD */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg text-sm">DEP</span>
                        Bases de Depósitos
                      </h3>
                      <a
                        href="/PLANTILLAS/PDEPOSITOS.xlsx"
                        download="PDEPOSITOS.xlsx"
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        Descargar Plantilla
                      </a>
                    </div>
                    <p className="text-xs text-slate-500">Formato requerido: No., TIPO PERSONA, VALIDADOR ID DEPOSITANTE, ID DEPOSITANTE, ACREEDOR, VINCULADO, GAP, TIPO GAP, SALDO TOTAL, etc.</p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".xlsx,.xlsm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileDepositos(file);
                          setSuccessDepositos(false);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {fileDepositos && (
                      <button
                        onClick={handleUploadDepositos}
                        disabled={loadingDepositos}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10"
                      >
                        {loadingDepositos ? "Procesando..." : "Importar a Depósitos"}
                      </button>
                    )}
                    {successDepositos && (
                      <p className="text-xs text-emerald-600 font-semibold">✓ Base de Depósitos cargada correctamente.</p>
                    )}
                  </div>
                </div>

                {/* 2. CARTERA CARD */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="bg-purple-50 text-purple-600 p-1.5 rounded-lg text-sm">CAR</span>
                        Bases de Cartera
                      </h3>
                      <a
                        href="/PLANTILLAS/PCARTERA.xlsx"
                        download="PCARTERA.xlsx"
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        Descargar Plantilla
                      </a>
                    </div>
                    <p className="text-xs text-slate-500">Formato requerido: CODIGO SOCIO, TIPO ID SOCIO, VALIDADOR ID SOCIO, NUMERO DE OPERACION, ID CLIENTE, SALDO CARTERA.</p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".xlsx,.xlsm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileCartera(file);
                          setSuccessCartera(false);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {fileCartera && (
                      <button
                        onClick={handleUploadCartera}
                        disabled={loadingCartera}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10"
                      >
                        {loadingCartera ? "Procesando..." : "Importar a Cartera"}
                      </button>
                    )}
                    {successCartera && (
                      <p className="text-xs text-emerald-600 font-semibold">✓ Base de Cartera cargada correctamente.</p>
                    )}
                  </div>
                </div>

                {/* 3. BIENES CARD */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="bg-amber-50 text-amber-600 p-1.5 rounded-lg text-sm">BIE</span>
                        Bienes Realizables
                      </h3>
                      <a
                        href="/PLANTILLAS/PBIENES.xlsx"
                        download="PBIENES.xlsx"
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        Descargar Plantilla
                      </a>
                    </div>
                    <p className="text-xs text-slate-500">Formato requerido: TIPO DE BIEN, DESCRIPCION, EXISTENCIA FISICA, Nº IDENTIFICACION, SALDO LIBROS, VALOR AVALUO.</p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".xlsx,.xlsm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileBienes(file);
                          setSuccessBienes(false);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {fileBienes && (
                      <button
                        onClick={handleUploadBienes}
                        disabled={loadingBienes}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10"
                      >
                        {loadingBienes ? "Procesando..." : "Importar a Bienes"}
                      </button>
                    )}
                    {successBienes && (
                      <p className="text-xs text-emerald-600 font-semibold">✓ Base de Bienes cargada correctamente.</p>
                    )}
                  </div>
                </div>

                {/* 4. BALANCES CARD */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg text-sm">BAL</span>
                        Balances Contables
                      </h3>
                      <a
                        href="/PLANTILLAS/PBALANCE.xlsx"
                        download="PBALANCE.xlsx"
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        Descargar Plantilla
                      </a>
                    </div>
                    <p className="text-xs text-slate-500">Formato requerido: NIVEL, CODIGO CUENTA, NOMBRE CUENTA, SALDO MES, FECHA REGISTRO.</p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".xlsx,.xlsm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileBalances(file);
                          setSuccessBalances(false);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {fileBalances && (
                      <button
                        onClick={handleUploadBalances}
                        disabled={loadingBalances}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10"
                      >
                        {loadingBalances ? "Procesando..." : "Importar a Balances"}
                      </button>
                    )}
                    {successBalances && (
                      <p className="text-xs text-emerald-600 font-semibold">✓ Base de Balances cargada correctamente.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset/Clear Section */}
              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <div>
                  <h4 className="text-red-800 font-bold text-md">Zona de Peligro: Restablecer Sistema</h4>
                  <p className="text-xs text-red-600 mt-1">Esta acción borrará por completo todos los registros actuales de Depósitos, Cartera, Bienes y Balances.</p>
                </div>
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-red-500/10"
                >
                  Limpiar Todas las Bases de Datos
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
