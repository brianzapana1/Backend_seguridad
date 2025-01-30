import { PrismaClient as PrismaMain } from "@prisma/client";
import { PrismaClient as PrismaLogs } from "../../node_modules/.prisma/client-logs/index.js"; // ✅ Correcto
import dotenv from "dotenv";

dotenv.config(); // ✅ Cargar variables de entorno

export const db = new PrismaMain(); // Base de datos principal
export const logsDb = new PrismaLogs(); // Base de datos de logs

// console.log("📌 Modelos disponibles en db:", Object.keys(db));
// console.log("📌 Modelos disponibles en logsDb:", Object.keys(logsDb));

const testConnections = async () => {
  try {
    await db.$connect();
    console.log("✅ Conectado a la base de datos principal");

    await logsDb.$connect();
    console.log("✅ Conectado a la base de datos de logs");
  } catch (error) {
    console.error("❌ Error conectando a las bases de datos:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  testConnections();
}

process.on("beforeExit", async () => {
  await db.$disconnect();
  await logsDb.$disconnect();
  console.log("🛑 Conexiones a bases de datos cerradas");
});
