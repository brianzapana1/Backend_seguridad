import { logsDb } from "../config/database.js";
import { obtenerFechaBolivia } from "../utils/fechaUtils.js"; // 📌 Importar función de fecha corregida

/**
 * Registra un intento de inicio de sesión en `Logs_Intentos_Login`.
 * @param {string|null} idUsuario - Nombre del usuario (puede ser null si el usuario no existe).
 * @param {string} ipUsuario - Dirección IP del usuario.
 * @param {boolean} exitoso - Indica si el intento fue exitoso o no.
 * @param {string|null} motivoFallo - Razón del fallo (si aplica).
 * @param {number} numeroIntento - Número del intento. Si es un reinicio, debe ser `0`.
 */
export const registrarIntentoLogin = async (idUsuario, ipUsuario, exitoso, motivoFallo, numeroIntento) => {
    try {
        // 📌 Obtener la fecha en la zona horaria de Bolivia correctamente
        const fechaBolivia = obtenerFechaBolivia();

        await logsDb.logs_Intentos_Login.create({
            data: {
                idUsuario,
                ipUsuario: ipUsuario || "0.0.0.0",
                Fecha_intento: fechaBolivia, // 📌 Se usa la función corregida
                Exitoso: exitoso,
                Motivo_fallo: motivoFallo || (exitoso ? "Reinicio de intentos tras inicio de sesión" : null),
                Numero_intento: exitoso ? 0 : numeroIntento, 
            },
        });

        console.log(`✅ Intento de login registrado: Usuario ${idUsuario}, Exitoso: ${exitoso}, Intento #${numeroIntento}`);
    } catch (error) {
        console.error("❌ Error registrando intento de login:", error.message);
    }
};
