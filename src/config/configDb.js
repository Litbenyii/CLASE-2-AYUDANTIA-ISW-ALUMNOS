"use strict";
import { DataSource } from "typeorm";
import { HOST, DB_USERNAME, PASSWORD, DB_PORT, DATABASE } from "./configEnv.js";

console.log("[DB CONFIG]", {
  HOST,
  DB_PORT,
  DB_USERNAME,
  PASSWORD: PASSWORD ? `***${String(PASSWORD).slice(-2)}` : undefined,
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
  // clave para certificado autofirmado:
  ssl: { rejectUnauthorized: false },
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión exitosa a la base de datos PostgreSQL!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
