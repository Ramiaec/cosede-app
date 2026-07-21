"use server";

import { prisma } from "../../lib/prisma";

// Auth / CooperativaUsuario
export async function verifyLogin(usuario: string, clave: string) {
  const user = await prisma.cooperativaUsuario.findUnique({
    where: { usuario },
  });
  if (user && user.clave === clave) {
    return user;
  }
  return null;
}

// EntidadLiquidadora (InicioData)
export async function getEntidadLiquidadora(rucCooperativa: string) {
  let entidad = await prisma.entidadLiquidadora.findUnique({
    where: { rucCooperativa },
    include: {
      bienes: true,
      depositos: true,
      carteras: true,
      balances: true,
    }
  });

  if (!entidad) {
    // Si no existe, crear la entidad en base al RUC (para que el usuario tenga un registro inicial)
    const coop = await prisma.cooperativaUsuario.findUnique({ where: { ruc: rucCooperativa } });
    if (coop) {
      entidad = await prisma.entidadLiquidadora.create({
        data: {
          rucCooperativa: coop.ruc,
          razonSocial: coop.razonSocial,
          tipoIdLiquidador: "R",
          idLiquidador: coop.ruc,
          nombreLiquidador: coop.liquidador,
          tipoLiquidacion: coop.estadoLiquidacion,
          aplicaSeguro: "SI",
          fechaLineaBase: new Date("2019-12-31"),
          fechaCorte: new Date(coop.fechaResolucion),
        },
        include: {
          bienes: true,
          depositos: true,
          carteras: true,
          balances: true,
        }
      });
    }
  }

  return entidad;
}

export async function updateEntidadLiquidadora(id: number, data: any) {
  return await prisma.entidadLiquidadora.update({
    where: { id },
    data,
  });
}

// Depositos
export async function saveDeposito(entidadId: number, data: any) {
  if (data.id && typeof data.id === "number") {
    // Check if it exists (might be a mock ID if migrating, but Prisma uses autoincrement)
    const exists = await prisma.deposito.findUnique({ where: { id: data.id } });
    if (exists) {
      return await prisma.deposito.update({ where: { id: data.id }, data: { ...data, entidadId: undefined } });
    }
  }
  
  // Remove id if it's a string/mock ID so Prisma can autoincrement
  const { id, pagos, ...createData } = data; 
  return await prisma.deposito.create({
    data: {
      ...createData,
      entidadId,
    },
  });
}

export async function deleteDeposito(id: number) {
  return await prisma.deposito.delete({ where: { id } });
}

// Bienes
export async function saveBien(entidadId: number, data: any) {
  if (data.id && typeof data.id === "number") {
    const exists = await prisma.bien.findUnique({ where: { id: data.id } });
    if (exists) {
      return await prisma.bien.update({ where: { id: data.id }, data: { ...data, entidadId: undefined } });
    }
  }
  
  const { id, ...createData } = data;
  return await prisma.bien.create({
    data: {
      ...createData,
      entidadId,
    },
  });
}

export async function deleteBien(id: number) {
  return await prisma.bien.delete({ where: { id } });
}

// Cartera
export async function saveCartera(entidadId: number, data: any) {
  if (data.id && typeof data.id === "number") {
    const exists = await prisma.carteraJuicio.findUnique({ where: { id: data.id } });
    if (exists) {
      return await prisma.carteraJuicio.update({ where: { id: data.id }, data: { ...data, entidadId: undefined } });
    }
  }
  
  const { id, pagos, ...createData } = data;
  return await prisma.carteraJuicio.create({
    data: {
      ...createData,
      entidadId,
    },
  });
}

export async function deleteCartera(id: number) {
  return await prisma.carteraJuicio.delete({ where: { id } });
}
