"use strict";

import { DataSource } from "typeorm";
import { HOST, DB_PORT, DB_USERNAME, PASSWORD, DATABASE } from "./configEnv.js";

console.log("[DB CONFIG]", {
  HOST,
  DB_PORT,
  DB_USERNAME,
  PASSWORD: `***${String(PASSWORD).slice(-2)}`,
  DATABASE,
});

export const AppDataSource = new DataSource({
  type: "postgres",
  host: HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: ["src/entities/**/*.js"],
  synchronize: true,
  logging: false,
  // Para certificados self-signed del servidor UBB:
  ssl: { rejectUnauthorized: false },
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión exitosa a la base de datos PostgreSQL!");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
