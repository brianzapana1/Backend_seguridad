import app from "./utils/app.js";
import { db, logsDb } from "./config/database.js";
import { registrarLogSistema } from "./services/logsSistema.service.js";

process.env.TZ = "America/La_Paz";

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

  try {
    await db.$connect();
    await logsDb.$connect();
    console.log("✅ Conectado a la base de datos principal");
    console.log("✅ Conectado a la base de datos de logs");

    await registrarLogSistema({
      idUsuario: null,
      Tipo_evento: "INICIO_SERVIDOR",
      Descripcion: "El servidor ha iniciado correctamente.",
      Nivel: "INFO",
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
    await registrarLogSistema({
      idUsuario: null,
      Tipo_evento: "ERROR_DB",
      Descripcion: `Fallo en la conexión a la base de datos: ${error.message}`,
      Nivel: "ERROR",
    });
    process.exit(1);
  }
}).on("error", async (err) => {
  console.error("❌ Error al iniciar el servidor:", err);
  await registrarLogSistema({
    idUsuario: null,
    Tipo_evento: "ERROR_INICIO",
    Descripcion: `Error al iniciar el servidor: ${err.message}`,
    Nivel: "ERROR",
  });
});

// Capturar errores globales no controlados
process.on("uncaughtException", async (error) => {
  console.error("❌ Error no controlado:", error.message);
  await registrarLogSistema({
    idUsuario: null,
    Tipo_evento: "ERROR_CRITICO",
    Descripcion: `Error no controlado: ${error.message}`,
    Nivel: "ERROR",
  });
});

process.on("unhandledRejection", async (reason) => {
  console.error("⚠️ Promesa rechazada sin manejar:", reason);
  await registrarLogSistema({
    idUsuario: null,
    Tipo_evento: "PROMESA_NO_MANEJADA",
    Descripcion: `Promesa rechazada sin manejar: ${reason}`,
    Nivel: "WARN",
  });
});
