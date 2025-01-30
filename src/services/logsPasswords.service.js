import { logsDb } from "../config/database.js";
import bcrypt from "bcryptjs";

/**
 * 📌 Función para obtener la fecha en la zona horaria local
 */
const obtenerFechaLocal = () => {
  const fecha = new Date();
  return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000); // Ajusta a la zona horaria local
};

/**
 * Registra un cambio de contraseña en `Logs_Passwords`
 * @param {string} nombreUsuario - Nombre del usuario que cambia la contraseña.
 * @param {string} passwordAnteriorHash - Hash de la contraseña anterior.
 * @param {string} motivo - Razón del cambio.
 */
export const registrarCambioContrasenia = async (nombreUsuario, passwordAnteriorHash, motivo) => {
  try {
    const fechaCambio = obtenerFechaLocal();
    const fechaSiguienteCambio = new Date(fechaCambio);
    fechaSiguienteCambio.setDate(fechaCambio.getDate() + 90); // 📌 Sumar 90 días

    // 📌 Insertar el registro en la tabla `Logs_Passwords`, usando `Nombre_usuario`
    await logsDb.logs_Passwords.create({
      data: {
        idUsuario: nombreUsuario, // 🔥 Guarda el nombre de usuario en lugar del ID
        Password_anterior_hash: passwordAnteriorHash,
        Fecha_cambio: fechaCambio.toISOString().replace("T", " ").slice(0, 19), // 📌 Formato YYYY-MM-DD HH:MM:SS
        Fecha_siguiente_cambio: fechaSiguienteCambio.toISOString().replace("T", " ").slice(0, 19),
        Motivo: motivo,
      },
    });

    console.log(`✅ Cambio de contraseña registrado: Usuario ${nombreUsuario}, Motivo: ${motivo}, Fecha: ${fechaCambio}`);
  } catch (error) {
    console.error("❌ Error registrando cambio de contraseña:", error.message);
  }
};

/**
 * Verifica si la nueva contraseña es diferente a las 2 últimas usadas.
 * @param {string} nombreUsuario - Nombre del usuario
 * @param {string} nuevaContrasenia - Nueva contraseña en texto plano
 * @returns {Promise<boolean>} - `true` si la contraseña es válida, `false` si es una repetida
 */
export const validarHistorialContrasenia = async (nombreUsuario, nuevaContrasenia) => {
  try {
    // 📌 Obtener las 2 últimas contraseñas del historial usando `Nombre_usuario`
    const ultimasContrasenas = await logsDb.logs_Passwords.findMany({
      where: { idUsuario: nombreUsuario }, // 🔥 Ahora se busca por `Nombre_usuario`
      orderBy: { Fecha_cambio: "desc" },
      take: 2, // 📌 Solo las 2 últimas contraseñas
    });

    // 📌 Si el usuario no tiene historial de cambios, permitir la nueva contraseña
    if (ultimasContrasenas.length === 0) {
      return true;
    }

    // 📌 Verificar si la nueva contraseña coincide con alguna de las anteriores
    for (const contrasena of ultimasContrasenas) {
      const coincide = await bcrypt.compare(nuevaContrasenia, contrasena.Password_anterior_hash);
      if (coincide) {
        console.warn(`⚠ La nueva contraseña no puede ser igual a las últimas 2 usadas.`);
        return false;
      }
    }

    return true; // ✅ Si pasó la validación, es una contraseña válida
  } catch (error) {
    console.error("❌ Error validando historial de contraseñas:", error.message);
    return false; // En caso de error, prevenir el cambio
  }
};
