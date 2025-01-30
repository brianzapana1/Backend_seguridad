import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  actualizarUsuarioPassword
} from "../services/usuario.service.js";
import { registrarLogSistema } from "../services/logsSistema.service.js";
import { registrarIntentoLogin } from "../services/logsIntentos.service.js";
import { db } from "../config/database.js";



export const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await obtenerUsuarios();
    if (!usuarios.length) {
      return res.status(404).json({ message: "No hay usuarios registrados." });
    }
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    next(error);
  }
};


export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const usuario = await obtenerUsuarioPorId(parseInt(id));

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // if (usuario.Bloqueado) {
    //   return res.status(403).json({ message: "Usuario bloqueado. No se puede acceder." });
    // }

    res.status(200).json(usuario);
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${req.params.id}:`, error.message);
    next(error);
  }
};


export const createUsuario = async (req, res, next) => {
  try {
    const { Nombre_usuario, Contrasenia, idPersona } = req.body;

    if (!Nombre_usuario || !Contrasenia || !idPersona) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    if (typeof Nombre_usuario !== "string" || Nombre_usuario.trim() === "") {
      return res.status(400).json({ error: "El nombre de usuario es inválido." });
    }

    if (typeof Contrasenia !== "string" || Contrasenia.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    if (isNaN(idPersona)) {
      return res.status(400).json({ error: "El ID de persona debe ser un número válido." });
    }

    const nuevoUsuario = await crearUsuario(
      { Nombre_usuario, Contrasenia, idPersona: parseInt(idPersona), Bloqueado: false }, // 🔥 Bloqueado por defecto en false
      req.userId
    );

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear usuario:", error.message);
    res.status(400).json({ error: error.message });
  }
};



export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const usuarioActual = await db.Usuario.findUnique({
      where: { idUsuario: parseInt(id) },
    });

    if (!usuarioActual) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const cambioEstado = usuarioActual.Bloqueado !== data.Bloqueado;
    
    let usuarioActualizado;

    if (cambioEstado) {
      usuarioActualizado = await db.Usuario.update({
        where: { idUsuario: parseInt(id) },
        data: {
          Bloqueado: data.Bloqueado,
          intentos_fallidos: data.Bloqueado ? 5 : 0, 
        },
      });
    } else {
      usuarioActualizado = await actualizarUsuario(parseInt(id), data);
    }

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado o sin cambios." });
    }

    const fechaISO = new Date().toISOString();

    if (cambioEstado) {
      if (data.Bloqueado === false) {
        await registrarLogSistema({
          idUsuario: parseInt(id),
          Tipo_evento: "DESBLOQUEO_MANUAL",
          Descripcion: `Usuario ${usuarioActual.Nombre_usuario} fue desbloqueado manualmente por un administrador.`,
          ipUsuario: req.ip || "0.0.0.0",
          Nivel: "INFO",
          Fecha: fechaISO,
        });

        await registrarIntentoLogin(
          parseInt(id),
          req.ip || "0.0.0.0",
          true,
          "Reinicio de intentos tras desbloqueo manual",
          0
        );

        console.log(`🔓 Usuario ${usuarioActual.Nombre_usuario} fue desbloqueado manualmente.`);
      } else {
        await registrarLogSistema({
          idUsuario: parseInt(id),
          Tipo_evento: "BLOQUEO_MANUAL",
          Descripcion: `Usuario ${usuarioActual.Nombre_usuario} fue bloqueado manualmente por un administrador.`,
          ipUsuario: req.ip || "0.0.0.0",
          Nivel: "CRÍTICO",
          Fecha: fechaISO,
        });

        await registrarIntentoLogin(
          parseInt(id),
          req.ip || "0.0.0.0",
          false,
          "Bloqueo manual por administrador",
          5 
        );

        console.log(`🚫 Usuario ${usuarioActual.Nombre_usuario} fue bloqueado manualmente.`);
      }
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${req.params.id}:`, error.message);
    next(error);
  }
};




export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    await eliminarUsuario(parseInt(id));

    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${req.params.id}:`, error.message);
    next(error);
  }
};

export const cambiarContrasenia = async (req, res, next) => {
  try {
    const idUsuario = req.userId; // ID del usuario autenticado desde el token
    const { contrasenaActual, nuevaContrasenia } = req.body;

    // 📌 Validación de entrada
    if (!idUsuario) {
      return res.status(403).json({ error: "No autorizado. Debes estar autenticado." });
    }

    if (!contrasenaActual || !nuevaContrasenia) {
      return res.status(400).json({ error: "Debes ingresar la contraseña actual y la nueva." });
    }

    if (nuevaContrasenia.length < 6) {
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    // 📌 Llamar al servicio para cambiar la contraseña
    const mensaje = await actualizarUsuarioPassword(idUsuario, contrasenaActual, nuevaContrasenia);

    res.status(200).json({ message: mensaje });
  } catch (error) {
    console.error(`❌ Error al cambiar la contraseña del usuario ${req.userId}:`, error.message);
    next(error);
  }
};


