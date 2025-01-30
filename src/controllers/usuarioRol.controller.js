import {
  obtenerUsuarioRoles,
  obtenerUsuarioRolPorId,
  asignarRolAUsuario,
  actualizarRolDeUsuario,
  eliminarRolDeUsuario,
} from "../services/usuarioRol.service.js";

/**
* Controlador para obtener todas las relaciones UsuarioRol.
*/
export const getUsuarioRoles = async (req, res, next) => {
  try {
      const usuarioRoles = await obtenerUsuarioRoles();
      res.status(200).json(usuarioRoles);
  } catch (error) {
      res.status(500).json({ error: "Error interno al obtener UsuarioRoles." });
  }
};

/**
* Controlador para obtener una relación UsuarioRol por ID.
*/
export const getUsuarioRolById = async (req, res, next) => {
  try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
          return res.status(400).json({ error: "El ID proporcionado no es válido." });
      }

      const usuarioRol = await obtenerUsuarioRolPorId(parseInt(id));

      if (!usuarioRol) {
          return res.status(404).json({ error: "UsuarioRol no encontrado." });
      }

      res.status(200).json(usuarioRol);
  } catch (error) {
      res.status(500).json({ error: "Error interno al obtener UsuarioRol." });
  }
};

/**
* Controlador para asignar un rol a un usuario.
*/
export const createUsuarioRol = async (req, res, next) => {
  try {
      const { idUsuario, idRol } = req.body;

      if (!idUsuario || isNaN(idUsuario) || !idRol || isNaN(idRol)) {
          return res.status(400).json({ error: "Los campos idUsuario e idRol son obligatorios y deben ser números." });
      }

      const nuevoUsuarioRol = await asignarRolAUsuario(parseInt(idUsuario), parseInt(idRol));

      res.status(201).json(nuevoUsuarioRol);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

/**
* Controlador para actualizar el rol de un usuario.
*/
export const updateUsuarioRol = async (req, res, next) => {
  try {
      const { id } = req.params;
      const { idRol } = req.body;

      if (!id || isNaN(id)) {
          return res.status(400).json({ error: "El ID de UsuarioRol es obligatorio y debe ser un número válido." });
      }

      if (!idRol || isNaN(idRol)) {
          return res.status(400).json({ error: "El ID de rol es obligatorio y debe ser un número válido." });
      }

      const usuarioRolActualizado = await actualizarRolDeUsuario(parseInt(id), parseInt(idRol));

      res.status(200).json(usuarioRolActualizado);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

/**
* Controlador para eliminar una relación Usuario-Rol.
*/
export const deleteUsuarioRol = async (req, res, next) => {
  try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
          return res.status(400).json({ error: "El ID de UsuarioRol es obligatorio y debe ser un número válido." });
      }

      await eliminarRolDeUsuario(parseInt(id));
      res.status(200).json({ message: "UsuarioRol eliminado correctamente." });
  } catch (error) {
      res.status(500).json({ error: "Error interno al eliminar UsuarioRol." });
  }
};
