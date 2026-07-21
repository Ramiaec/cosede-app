-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "EntidadLiquidadora" (
    "id" SERIAL NOT NULL,
    "rucCooperativa" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "tipoIdLiquidador" TEXT NOT NULL,
    "idLiquidador" TEXT NOT NULL,
    "nombreLiquidador" TEXT NOT NULL,
    "tipoLiquidacion" TEXT NOT NULL,
    "aplicaSeguro" TEXT NOT NULL,
    "fechaLineaBase" TIMESTAMP(3) NOT NULL,
    "fechaCorte" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntidadLiquidadora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposito" (
    "id" SERIAL NOT NULL,
    "entidadId" INTEGER NOT NULL,
    "numeroRegistro" INTEGER NOT NULL,
    "tipoPersona" TEXT,
    "validadorId" TEXT NOT NULL,
    "tipoIdAcreedor" TEXT,
    "idAcreedor" TEXT,
    "nombreAcreedor" TEXT,
    "agenciaCanton" TEXT,
    "vinculado" TEXT,
    "tipoVinculado" TEXT,
    "saldoTotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarteraJuicio" (
    "id" SERIAL NOT NULL,
    "entidadId" INTEGER NOT NULL,
    "codigoSocio" TEXT,
    "tipoIdSocio" TEXT,
    "validadorIdSocio" TEXT,
    "numeroOperacion" TEXT,
    "idCliente" TEXT,
    "relacion" TEXT,
    "nombreSocio" TEXT,
    "estadoCivil" TEXT,
    "saldoFecha" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarteraJuicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bien" (
    "id" SERIAL NOT NULL,
    "entidadId" INTEGER NOT NULL,
    "tipoBien" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "existenciaFisica" BOOLEAN NOT NULL,
    "numeroIdentificacion" TEXT NOT NULL,
    "ubicacionCanton" TEXT NOT NULL,
    "saldoLibros" DOUBLE PRECISION NOT NULL,
    "valorAvaluo" DOUBLE PRECISION NOT NULL,
    "disponibilidad" TEXT NOT NULL,
    "fechaVenta" TIMESTAMP(3),
    "valorVenta" DOUBLE PRECISION,
    "tipoVenta" TEXT,
    "compradorId" TEXT,
    "razonSocialComprador" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "entidadId" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "codigoCuenta" TEXT NOT NULL,
    "nombreCuenta" TEXT NOT NULL,
    "saldoMes" DOUBLE PRECISION NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CooperativaUsuario" (
    "id" SERIAL NOT NULL,
    "ruc" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "estadoLiquidacion" TEXT NOT NULL,
    "fechaResolucion" TIMESTAMP(3) NOT NULL,
    "liquidador" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CooperativaUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntidadLiquidadora_rucCooperativa_key" ON "EntidadLiquidadora"("rucCooperativa");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativaUsuario_ruc_key" ON "CooperativaUsuario"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "CooperativaUsuario_usuario_key" ON "CooperativaUsuario"("usuario");

-- AddForeignKey
ALTER TABLE "Deposito" ADD CONSTRAINT "Deposito_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "EntidadLiquidadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarteraJuicio" ADD CONSTRAINT "CarteraJuicio_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "EntidadLiquidadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "EntidadLiquidadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "EntidadLiquidadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

