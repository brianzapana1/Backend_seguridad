import {
  obtenerActividades,
  obtenerActividadPorId,
  crearActividad,
  actualizarActividad,
  eliminarActividad
} from "../services/actividades.service.js";

/**
 * Controlador para obtener todas las actividades.
 */
export const getActividades = async (req, res, next) => {
  try {
    const actividades = await obtenerActividades();
    res.status(200).json(actividades);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para obtener una actividad por ID.
 */
export const getActividadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const actividad = await obtenerActividadPorId(parseInt(id));
    res.status(200).json(actividad);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para crear una nueva actividad.
 */
export const createActividad = async (req, res, next) => {
  try {
    const { idUsuario, Titulo, Descripcion, Fecha_inicio, Fecha_fin, Tipo } = req.body;

    const nuevaActividad = await crearActividad({
      idUsuario,
      Titulo,
      Descripcion,
      Fecha_inicio,
      Fecha_fin,
      Tipo
    });

    res.status(201).json(nuevaActividad);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para actualizar una actividad.
 */
export const updateActividad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const actividadActualizada = await actualizarActividad(parseInt(id), data);
    res.status(200).json(actividadActualizada);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para eliminar una actividad.
 */
export const deleteActividad = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    await eliminarActividad(parseInt(id));
    res.status(200).json({ message: "Actividad eliminada correctamente." });
  } catch (error) {
    next(error);
  }
};
