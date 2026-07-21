const fs = require('fs');
const { Client } = require('@neondatabase/serverless');

async function run() {
  const seedSql = `
    INSERT INTO "CooperativaUsuario" ("ruc", "razonSocial", "estadoLiquidacion", "fechaResolucion", "liquidador", "usuario", "clave", "createdAt")
    VALUES ('1891725791001', 'COOPERATIVA DE AHORRO Y CREDITO EJEMPLO', 'EN LIQUIDACION', '2026-06-30T00:00:00.000Z', 'JUAN FERNANDEZ', '1891725791001', '1234', NOW())
    ON CONFLICT ("ruc") DO NOTHING;
  `;
  const client = new Client(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log("Connected to Neon serverless!");
    
    console.log("Executing seed...");
    await client.query(seedSql);
    
    console.log("Successfully ran migrations.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
