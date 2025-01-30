import { logsDb } from "../config/database.js";
import { obtenerFechaBolivia } from "../utils/fechaUtils.js";
/**
 * Registra un evento en Logs_Sistema.
 * @param {Object} data - Información del evento a registrar.
 * @param {string|null} data.idUsuario - Nombre del usuario o null si es un evento del sistema.
 * @param {string} data.Tipo_evento - Tipo de evento (ej. INICIO_SERVIDOR, ERROR_DB, LOGIN_EXITOSO, etc.).
 * @param {string} data.Descripcion - Descripción del evento.
 * @param {string} data.Nivel - Nivel del evento (INFO, WARN, ERROR, CRÍTICO).
 * @param {string} [data.ipUsuario] - Dirección IP del usuario (opcional).
 */
export const registrarLogSistema = async ({ idUsuario, Tipo_evento, Descripcion, Nivel, ipUsuario }) => {
  try {
    const fechaBolivia = obtenerFechaBolivia();


    await logsDb.logs_Sistema.create({
      data: {
        idUsuario: idUsuario !== null ? idUsuario : null, // Se mantiene compatibilidad con eventos de sistema
        Tipo_evento,
        Descripcion,
        ipUsuario: ipUsuario || "0.0.0.0",
        Nivel,
        Fecha: fechaBolivia, // 📌 Guardamos la fecha en UTC
      },
    });

    console.log(`✅ Log registrado en Logs_Sistema: [${Tipo_evento}] - ${Descripcion} - ${fechaBolivia}`);
  } catch (error) {
    console.error("❌ Error registrando log en Logs_Sistema:", error.message);
  }
};
