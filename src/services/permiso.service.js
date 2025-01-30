import { db} from "../config/database.js";
import { logsDb } from "../config/database.js"; // 📌 Base de datos de logs
import { registrarLogPermiso } from "./logsPermisos.service.js"; // 📌 Función para registrar logs

/**
 * Obtiene todos los permisos.
 */
export const obtenerPermisos = async () => {
  try {
    return await prisma.permisos.findMany({
      include: {
        Modulo: true,
        UsuarioRol: {
          include: {
            Usuario: true,
            Rol: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Error al obtener los permisos: " + error.message);
  }
};

/**
 * Obtiene un permiso por ID.
 */
export const obtenerPermisoPorId = async (idPermiso) => {
  try {
    const permiso = await prisma.permisos.findUnique({
      where: { idPermiso: parseInt(idPermiso) },
      include: {
        Modulo: true,
        UsuarioRol: {
          include: {
            Usuario: true,
            Rol: true,
          },
        },
      },
    });

    if (!permiso) {
      throw new Error("Permiso no encontrado.");
    }

    return permiso;
  } catch (error) {
    throw new Error("Error al obtener el permiso: " + error.message);
  }
};

/**
 * Crea un nuevo permiso.
 */
export const crearPermiso = async (data, idAdministrador_mod) => {
  try {
    // 📌 Verificar si el módulo y el usuario-rol existen
    const modulo = await prisma.modulo.findUnique({
      where: { idModulo: data.idModulo },
    });

    const usuarioRol = await prisma.usuarioRol.findUnique({
      where: { idUsuarioRol: data.idUsuarioRol },
      include: { Usuario: { select: { Nombre_usuario: true } } }, // 🔥 Se obtiene el nombre del usuario
    });

    if (!modulo) {
      throw new Error("El módulo especificado no existe.");
    }

    if (!usuarioRol || !usuarioRol.Usuario) {
      throw new Error("El usuario-rol especificado no existe.");
    }

    // 📌 Obtener el nombre del usuario administrador
    const adminUsuario = await prisma.usuario.findUnique({
      where: { idUsuario: idAdministrador_mod },
      select: { Nombre_usuario: true },
    });

    if (!adminUsuario) {
      throw new Error("Administrador no encontrado o no autorizado.");
    }

    const nombreAdmin = adminUsuario.Nombre_usuario; // 🔥 Nombre del administrador
    const nombreUsuarioRol = usuarioRol.Usuario.Nombre_usuario; // 🔥 Nombre del usuario afectado

    // 📌 Crear el permiso en la base de datos
    const nuevoPermiso = await prisma.permisos.create({ data });

    // 📌 Registrar la creación del permiso en Logs_Permisos con nombres en lugar de IDs
    await registrarLogPermiso({
      idAdministrador_mod: nombreAdmin, // 🔥 Nombre del usuario administrador
      idUsuario: nombreUsuarioRol, // 🔥 Nombre del usuario que recibe el permiso
      idModulo: data.idModulo,
      Permiso: "CREACIÓN_PERMISO",
      Estado: true,
    });

    console.log(`✅ Permiso creado en módulo ${data.idModulo} para usuario ${nombreUsuarioRol}`);

    return nuevoPermiso;
  } catch (error) {
    console.error("❌ Error al asignar permiso:", error.message);
    throw new Error("Error al asignar permiso: " + error.message);
  }
};

/**
 * Actualiza un permiso por ID.
 */
export const actualizarPermiso = async (idModulo, idUsuarioRol, data, nombreAdmin) => {
  try {
    console.log("📌 Iniciando actualización de permisos para módulo:", idModulo, "y usuario rol:", idUsuarioRol);

    // 📌 Obtener la fecha en UTC y ajustarla a Bolivia (UTC-4)
    const fechaUTC = new Date();
    const fechaBolivia = new Date(fechaUTC.getTime() - 4 * 60 * 60 * 1000).toISOString();

    // 📌 Buscar el permiso en la base de datos principal (`db`)
    const permisoExistente = await db.permisos.findFirst({
      where: {
        idModulo: idModulo,
        idUsuarioRol: idUsuarioRol,
      },
    });

    // 📌 Validar que `nombreAdmin` está definido correctamente
    if (!nombreAdmin) {
      throw new Error("❌ Nombre del administrador no proporcionado.");
    }

    console.log(`📌 Nombre del administrador: ${nombreAdmin}`);

    // 📌 Obtener el nombre del usuario al que se le está modificando el permiso
    const usuarioRol = await db.usuarioRol.findUnique({
      where: { idUsuarioRol },
      select: {
        Usuario: {
          select: { Nombre_usuario: true },
        },
      },
    });

    if (!usuarioRol || !usuarioRol.Usuario || !usuarioRol.Usuario.Nombre_usuario) {
      throw new Error(`❌ No se encontró el usuario para el rol ID ${idUsuarioRol}`);
    }

    const nombreUsuarioRol = usuarioRol.Usuario.Nombre_usuario; // 🔥 Nombre del usuario afectado
    console.log(`📌 Nombre del usuario afectado: ${nombreUsuarioRol}`);

    if (permisoExistente) {
      console.log(`✅ Permiso encontrado con ID ${permisoExistente.idPermiso}. Procediendo a actualizar...`);

      // 🔥 Si el permiso ya existe, actualizarlo en `db`
      const permisoActualizado = await db.permisos.update({
        where: { idPermiso: permisoExistente.idPermiso },
        data: {
          Crear: data.Crear,
          Actualizar: data.Actualizar,
          Eliminar: data.Eliminar,
          Leer: data.Leer,
          Reportes: data.Reportes,
        },
      });

      // 📌 Registrar en logs de permisos con el nombre del administrador en `logsDb`
      await logsDb.logs_Permissions.create({
        data: {
          idAdministrador_mod: nombreAdmin, // 🔥 Nombre del usuario administrador
          idUsuario: nombreUsuarioRol, // 🔥 Nombre del usuario afectado
          idModulo,
          Permiso: `Crear:${data.Crear}, Actualizar:${data.Actualizar}, Eliminar:${data.Eliminar}, Leer:${data.Leer}, Reportes:${data.Reportes}`,
          Fecha: fechaBolivia, // 📌 Se registra con la hora correcta
        },
      });

      console.log(`✅ Permiso actualizado en módulo ${idModulo} para usuario ${nombreUsuarioRol}`);
      return permisoActualizado;
    } else {
      console.warn(`⚠️ No se encontró un permiso existente. Creando nuevo permiso para módulo ${idModulo} y usuario ${nombreUsuarioRol}.`);

      // 🔥 Crear un nuevo permiso en `db`
      const nuevoPermiso = await db.permisos.create({
        data: {
          idModulo,
          idUsuarioRol,
          Crear: data.Crear,
          Actualizar: data.Actualizar,
          Eliminar: data.Eliminar,
          Leer: data.Leer,
          Reportes: data.Reportes,
        },
      });

      // 📌 Registrar en logs de permisos con el nombre del administrador en `logsDb`
      await logsDb.logs_Permissions.create({
        data: {
          idAdministrador_mod: nombreAdmin, // 🔥 Nombre del usuario administrador
          idUsuario: nombreUsuarioRol, // 🔥 Nombre del usuario afectado
          idModulo,
          Permiso: `Crear:${data.Crear}, Actualizar:${data.Actualizar}, Eliminar:${data.Eliminar}, Leer:${data.Leer}, Reportes:${data.Reportes}`,
          Fecha: fechaBolivia, // 📌 Se registra con la hora correcta
        },
      });

      console.log(`✅ Nuevo permiso creado en módulo ${idModulo} para usuario ${nombreUsuarioRol}`);
      return nuevoPermiso;
    }
  } catch (error) {
    console.error("❌ Error al actualizar/crear el permiso:", error.message);
    throw new Error(error.message);
  }
};



/**
 * Elimina un permiso por ID.
 */
export const eliminarPermiso = async (idPermiso) => {
  try {
    // Verificar si el permiso existe
    const permisoExistente = await prisma.permisos.findUnique({
      where: { idPermiso: parseInt(idPermiso) },
    });

    if (!permisoExistente) {
      throw new Error("Permiso no encontrado.");
    }

    await prisma.permisos.delete({
      where: { idPermiso: parseInt(idPermiso) },
    });

    return { message: "Permiso eliminado correctamente." };
  } catch (error) {
    throw new Error("Error al eliminar el permiso: " + error.message);
  }
};
