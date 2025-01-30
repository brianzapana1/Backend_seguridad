import {
    obtenerPermisos,
    obtenerPermisoPorId,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso,
  } from "../services/permiso.service.js";
  
  import { db } from "../config/database.js"; // 📌 Base de datos principal
  import { logsDb } from "../config/database.js"; // 📌 Base de datos de logs
  import { registrarLogPermiso } from "../services/logsPermisos.service.js";
  /**
   * Controlador para obtener todos los permisos.
   */
  export const getPermisos = async (req, res, next) => {
    try {
      const permisos = await obtenerPermisos();
      res.json(permisos);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener un permiso por ID.
   */
  export const getPermisoById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const permiso = await obtenerPermisoPorId(id);
  
      if (!permiso) {
        return res.status(404).json({ message: "Permiso no encontrado" });
      }
  
      res.json(permiso);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear un nuevo permiso.
   */
  export const createPermiso = async (req, res, next) => {
    try {
        const { idModulo, idUsuarioRol, Crear, Actualizar, Eliminar, Leer, Reportes } = req.body;
        const idAdministrador_mod = req.userId || req.user?.userId; // 🔥 Obtiene el ID del administrador

        if (!idAdministrador_mod || !idModulo || !idUsuarioRol) {
            return res.status(400).json({ error: "Faltan datos obligatorios." });
        }

        // 📌 Obtener el nombre del usuario administrador desde `Usuario`
        const adminUsuario = await db.Usuario.findUnique({
            where: { idUsuario: idAdministrador_mod },
            select: { Nombre_usuario: true },
        });

        if (!adminUsuario) {
            return res.status(403).json({ error: "Administrador no encontrado o no autorizado." });
        }

        const nombreAdmin = adminUsuario.Nombre_usuario; // 🔥 Nombre del administrador

        // 📌 Obtener el nombre del usuario al que se le asignará el permiso desde `UsuarioRol`
        const usuarioRol = await db.UsuarioRol.findUnique({
            where: { idUsuarioRol },
            select: {
                Usuario: {
                    select: { Nombre_usuario: true }, // 🔥 Extraemos el nombre del usuario
                },
            },
        });

        if (!usuarioRol || !usuarioRol.Usuario) {
            return res.status(404).json({ error: "Usuario no encontrado para el rol asignado." });
        }

        const nombreUsuarioRol = usuarioRol.Usuario.Nombre_usuario; // 🔥 Nombre del usuario que recibe el permiso

        // 📌 Crear el permiso en la base de datos
        const nuevoPermiso = await crearPermiso({
            idModulo,
            idUsuarioRol,
            Crear,
            Actualizar,
            Eliminar,
            Leer,
            Reportes,
        });

        // 📌 Registrar la creación del permiso en Logs_Permisos con nombres en lugar de IDs
        await registrarLogPermiso({
            idAdministrador_mod: nombreAdmin, // 🔥 Nombre del usuario administrador
            idUsuario: nombreUsuarioRol, // 🔥 Nombre del usuario que recibe el permiso
            idModulo,
            Permiso: "CREACIÓN_PERMISO",
            Estado: true,
        });

        console.log(`✅ Permiso creado en módulo ${idModulo} para usuario ${nombreUsuarioRol}`);

        res.status(201).json(nuevoPermiso);
    } catch (error) {
        console.error("❌ Error en createPermiso:", error.message);
        next(error);
    }
};

  
  /**
   * Controlador para actualizar un permiso.
   */

  
  export const updatePermiso = async (req, res, next) => {
    try {
      const { permisos } = req.body;
      const idAdministrador_mod = req.userId || req.user?.userId;
  
      console.log("📥 [PUT] /api/permisos/16 - Usuario", idAdministrador_mod);
      console.log("📌 Request Body recibido:", JSON.stringify(permisos, null, 2));
  
      if (!idAdministrador_mod) {
        console.error("❌ Error: `idAdministrador_mod` está undefined.");
        return res.status(400).json({ error: "Administrador no autorizado o no especificado." });
      }
  
      if (!permisos || !Array.isArray(permisos)) {
        return res.status(400).json({ error: "El campo 'permisos' es obligatorio y debe ser un array." });
      }
  
      // 📌 Obtener el nombre del administrador desde `db`
      const adminUsuario = await db.usuario.findUnique({
        where: { idUsuario: idAdministrador_mod },
        select: { Nombre_usuario: true },
      });
  
      if (!adminUsuario || !adminUsuario.Nombre_usuario) {
        console.error(`❌ Error: No se encontró el usuario administrador con ID ${idAdministrador_mod}.`);
        return res.status(403).json({ error: "Administrador no encontrado o no autorizado." });
      }
  
      const nombreAdmin = adminUsuario.Nombre_usuario; // 🔥 Se usará en los logs
      console.log("📌 Nombre del administrador:", nombreAdmin);
  
      for (const permiso of permisos) {
        const { idModulo, idUsuarioRol, Crear, Actualizar, Eliminar, Leer, Reportes } = permiso;
  
        if (!idModulo || !idUsuarioRol) {
          console.warn(`⚠️ Datos incompletos en permiso de módulo ${idModulo} para usuario ${idUsuarioRol}`);
          continue;
        }
  
        console.log(`📌 Procesando permiso para Módulo: ${idModulo}, UsuarioRol: ${idUsuarioRol}`);
  
        // 📌 Obtener el nombre del usuario afectado desde `db`
        const usuarioRol = await db.usuarioRol.findUnique({
          where: { idUsuarioRol },
          select: {
            Usuario: {
              select: { Nombre_usuario: true },
            },
          },
        });
  
        if (!usuarioRol || !usuarioRol.Usuario || !usuarioRol.Usuario.Nombre_usuario) {
          console.warn(`⚠️ No se encontró el usuario para el rol ID ${idUsuarioRol}`);
          continue;
        }
  
        const nombreUsuarioRol = usuarioRol.Usuario.Nombre_usuario; // 🔥 Nombre del usuario afectado
        console.log(`📌 Nombre del usuario afectado: ${nombreUsuarioRol}`);
  
        // 📌 Llamar a actualizarPermiso pasando el **nombre del admin**.
        // ⚠️ 🚀 🚀 AQUÍ YA SE REGISTRARÁ EN LOS LOGS DESDE `permiso.service.js`
        await actualizarPermiso(idModulo, idUsuarioRol, { Crear, Actualizar, Eliminar, Leer, Reportes }, nombreAdmin);
  
        console.log(`✅ Permiso actualizado en módulo ${idModulo} para usuario ${nombreUsuarioRol}`);
      }
  
      res.json({ message: "Permisos actualizados correctamente" });
    } catch (error) {
      console.error("❌ Error en updatePermiso:", error.message);
      next(error);
    }
  };
  
  

  
  /**
   * Controlador para eliminar un permiso.
   */
  export const deletePermiso = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idAdministrador_mod = req.userId || req.user?.userId; // 🔥 Ahora siempre obtiene el ID

        if (!idAdministrador_mod) {
            return res.status(400).json({ error: "Se requiere el ID del administrador que eliminó el permiso." });
        }

        const permisoExistente = await obtenerPermisoPorId(id);
        if (!permisoExistente) {
            return res.status(404).json({ error: "Permiso no encontrado." });
        }

        await eliminarPermiso(id);

        // 🔥 Registrar la eliminación del permiso en Logs_Permisos
        await registrarLogPermiso({
            idAdministrador_mod,
            idUsuario: permisoExistente.idUsuarioRol,
            idModulo: permisoExistente.idModulo,
            Permiso: "ELIMINACIÓN_PERMISO",
            Estado: false,
        });

        res.json({ message: "Permiso eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};
  