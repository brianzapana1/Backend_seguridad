import { db as prisma, logsDb } from "../config/database.js";
import bcrypt from "bcryptjs";
import { registrarCambioContrasenia } from "./logsPasswords.service.js";
import { registrarLogSistema } from "./logsSistema.service.js";

export const obtenerUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: { Persona: true },
    });

    if (!usuarios.length) {
      throw new Error("No hay usuarios registrados.");
    }

    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    throw new Error("No se pudieron obtener los usuarios.");
  }
};

export const obtenerUsuarioPorId = async (idUsuario) => {
  try {
    if (isNaN(idUsuario)) {
      throw new Error("El ID debe ser un número válido.");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: parseInt(idUsuario) },
      include: { Persona: true },
    });

    if (!usuario) {
      throw new Error("Usuario no encontrado.");
    }

    return usuario;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${idUsuario}:`, error.message);
    throw new Error(error.message);
  }
};

export const crearUsuario = async (data, userId) => {
  try {
    const { Nombre_usuario, Contrasenia, idPersona } = data;

    console.log(`🆕 Creación de usuario por ${userId} - Nombre: ${Nombre_usuario}`);

    const persona = await prisma.persona.findUnique({ where: { idPersona } });
    if (!persona) throw new Error("La persona asociada no existe en la base de datos.");

    const usuarioExistente = await prisma.usuario.findUnique({ where: { Nombre_usuario } });
    if (usuarioExistente) throw new Error("El nombre de usuario ya está en uso.");

    const hashedPassword = await bcrypt.hash(Contrasenia, 10);

    return await prisma.usuario.create({
      data: {
        Nombre_usuario,
        Contrasenia: hashedPassword,
        idPersona,
        Bloqueado: false,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    throw new Error(error.message);
  }
};

export const actualizarUsuario = async (idUsuario, data) => {
  try {
    if (isNaN(idUsuario)) {
      throw new Error("El ID debe ser un número válido.");
    }

    if (data.Contrasenia) {
      data.Contrasenia = await bcrypt.hash(data.Contrasenia, 10);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { idUsuario: parseInt(idUsuario) },
      data,
    });

    return usuarioActualizado;
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${idUsuario}:`, error.message);
    throw new Error("No se pudo actualizar el usuario.");
  }
};

export const actualizarUsuarioPassword = async (idUsuario, contrasenaActual, nuevaContrasenia) => {
  try {
    // 📌 Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario },
    });

    if (!usuario) {
      throw new Error("Usuario no encontrado.");
    }

    // 📌 Extraemos el nombre de usuario
    const nombreUsuario = usuario.Nombre_usuario; // 🔥 Ahora se usará en logs_Passwords

    // 📌 Verificar si la contraseña actual es correcta
    const esCorrecta = await bcrypt.compare(contrasenaActual, usuario.Contrasenia);
    if (!esCorrecta) {
      throw new Error("La contraseña actual es incorrecta.");
    }

    // 📌 Obtener las últimas 2 contraseñas del historial desde logsDb usando `Nombre_usuario`
    const ultimasContrasenas = await logsDb.logs_Passwords.findMany({
      where: { idUsuario: nombreUsuario }, // 🔥 Se usa `Nombre_usuario` en lugar de `idUsuario`
      orderBy: { Fecha_cambio: "desc" },
      take: 2,
    });

    // 📌 Si el usuario ya ha cambiado su contraseña antes, validar restricciones
    if (ultimasContrasenas.length > 0) {
      for (const contrasena of ultimasContrasenas) {
        const coincide = await bcrypt.compare(nuevaContrasenia, contrasena.Password_anterior_hash);
        if (coincide) {
          throw new Error("❌ No puedes usar una de tus últimas 2 contraseñas.");
        }
      }
    }

    // 📌 Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const nuevaContrasenaHash = await bcrypt.hash(nuevaContrasenia, salt);

    // 📌 Calcular las fechas en la zona horaria local y convertirlas a UTC para Prisma
    const fechaCambioLocal = new Date();
    const fechaSiguienteCambioLocal = new Date(fechaCambioLocal);
    fechaSiguienteCambioLocal.setDate(fechaCambioLocal.getDate() + 90);

    // 📌 Convertir fechas locales a ISO-8601 (UTC)
    const fechaCambioUTC = new Date(fechaCambioLocal.getTime() - fechaCambioLocal.getTimezoneOffset() * 60000).toISOString();
    const fechaSiguienteCambioUTC = new Date(fechaSiguienteCambioLocal.getTime() - fechaSiguienteCambioLocal.getTimezoneOffset() * 60000).toISOString();

    // 📌 Registrar el cambio en `Logs_Passwords` en logsDb con `Nombre_usuario`
    await logsDb.logs_Passwords.create({
      data: {
        idUsuario: nombreUsuario, // 🔥 Se guarda el nombre de usuario en logs
        Password_anterior_hash: usuario.Contrasenia, // Guarda la contraseña anterior
        Fecha_cambio: fechaCambioUTC, // 📌 Se registra en formato ISO-8601 (UTC)
        Fecha_siguiente_cambio: fechaSiguienteCambioUTC, // 📌 Nueva fecha de vencimiento
        Motivo: "Cambio de contraseña por usuario",
      },
    });

    // 📌 Actualizar la contraseña en la base de datos principal (`db`)
    await prisma.usuario.update({
      where: { idUsuario },
      data: { 
        Contrasenia: nuevaContrasenaHash,
      },
    });

    // 📌 Registrar en logs del sistema
    await registrarLogSistema({
      idUsuario: nombreUsuario, // 🔥 Se cambia `idUsuario` a `nombreUsuario` en logs
      Tipo_evento: "CAMBIO_CONTRASEÑA",
      Descripcion: `El usuario ${usuario.Nombre_usuario} ha cambiado su contraseña.`,
      ipUsuario: "0.0.0.0",
      Nivel: "INFO",
      Fecha: fechaCambioUTC, // 📌 Se registra la fecha en formato UTC
    });

    return "✅ Contraseña cambiada exitosamente.";
  } catch (error) {
    console.error("❌ Error en actualizarUsuarioPassword:", error.message);
    throw error;
  }
};




export const eliminarUsuario = async (id) => {
  const userId = parseInt(id, 10);
  if (isNaN(userId)) throw new Error("❌ El ID proporcionado no es válido.");

  const existingUser = await prisma.usuario.findUnique({
    where: { idUsuario: userId },
  });

  if (!existingUser) throw new Error("❌ Usuario no encontrado.");

  try {
    // 🔥 1. Eliminar todos los permisos relacionados con los roles del usuario
    await prisma.permisos.deleteMany({
      where: {
        idUsuarioRol: {
          in: (
            await prisma.usuarioRol.findMany({
              where: { idUsuario: userId },
              select: { idUsuarioRol: true },
            })
          ).map((rol) => rol.idUsuarioRol),
        },
      },
    });

    // 🔥 2. Eliminar todas las relaciones en UsuarioRol
    await prisma.usuarioRol.deleteMany({
      where: { idUsuario: userId },
    });

    // ✅ 3. Ahora sí, eliminar el usuario
    await prisma.usuario.delete({
      where: { idUsuario: userId },
    });

    return { message: "✅ Usuario eliminado correctamente." };
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error.message);
    throw new Error("No se pudo eliminar el usuario.");
  }
};
