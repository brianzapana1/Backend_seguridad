import { logsDb } from "../config/database.js";

/**
 * Registra un evento en la tabla Logs_Permisos.
 * @param {Object} data - Información del evento.
 * @param {string} data.idAdministrador_mod - Nombre del administrador que realizó la acción.
 * @param {string} data.idUsuario - Nombre del usuario afectado.
 * @param {number} data.idModulo - ID del módulo afectado.
 * @param {string} data.Permiso - Permiso asignado o removido (Ejemplo: "CREAR", "EDITAR").
 * @param {boolean} data.Estado - Estado del permiso (true para asignado, false para removido).
 */
export const registrarLogPermiso = async ({ idAdministrador_mod, idUsuario, idModulo, Permiso, Estado }) => {
    try {
        // 📌 Se obtiene la fecha en UTC y se convierte a formato ISO
        const fechaActualLocal = new Date();
        const fechaUTC = new Date(fechaActualLocal.getTime() - fechaActualLocal.getTimezoneOffset() * 60000).toISOString();

        // 📌 Registrar en logs de permisos con el nombre del administrador y del usuario afectado en `logsDb`
        // 📌 Registrar en logs de permisos con el nombre del administrador y del usuario afectado en `logsDb`
        // 📌 Registrar en logs de permisos con el nombre del administrador y del usuario afectado en `logsDb`
        await logsDb.logs_Permissions.create({
            data: {
            idAdministrador_mod: nombreAdmin ? nombreAdmin.substring(0, 100) : "Desconocido", // 🔥 Limitar a 100 caracteres
            idUsuario: nombreUsuarioRol ? nombreUsuarioRol.substring(0, 100) : "Desconocido", // 🔥 Limitar a 100 caracteres
            idModulo,
            Permiso: `C:${Crear ? "✔" : "✖"} A:${Actualizar ? "✔" : "✖"} E:${Eliminar ? "✔" : "✖"} L:${Leer ? "✔" : "✖"} R:${Reportes ? "✔" : "✖"}`
                .substring(0, 50), // 🔥 Asegurar que `Permiso` no supere los 50 caracteres
            Estado: true,
            Fecha: fechaUTC, // 📌 Se registra la fecha en formato ISO
            },
        });
  
  
  

        console.log(`✅ Log de permiso registrado: [${Permiso}] para usuario ${idUsuario} - Fecha: ${fechaISO}`);
    } catch (error) {
        console.error("❌ Error registrando log en Logs_Permissions:", error.message);
    }
};
