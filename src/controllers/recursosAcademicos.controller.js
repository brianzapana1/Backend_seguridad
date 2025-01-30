import {
  obtenerRecursosAcademicos,
  obtenerRecursoPorId,
  crearRecursoAcademico,
  actualizarRecursoAcademico,
  eliminarRecursoAcademico
} from "../services/recursosAcademicos.service.js";

/**
 * Controlador para obtener todos los recursos académicos.
 */
export const getRecursosAcademicos = async (req, res, next) => {
  try {
    const recursos = await obtenerRecursosAcademicos();
    res.status(200).json(recursos);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para obtener un recurso académico por ID.
 */
export const getRecursoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const recurso = await obtenerRecursoPorId(parseInt(id));
    res.status(200).json(recurso);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para crear un nuevo recurso académico.
 */
export const createRecursoAcademico = async (req, res, next) => {
  try {
    const { idUsuario, Titulo, Autor, Tipo, Categoria, Portada, Archivo } = req.body;

    const nuevoRecurso = await crearRecursoAcademico({
      idUsuario,
      Titulo,
      Autor,
      Tipo,
      Categoria,
      Portada,
      Archivo
    });

    res.status(201).json(nuevoRecurso);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para actualizar un recurso académico.
 */
export const updateRecursoAcademico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const recursoActualizado = await actualizarRecursoAcademico(parseInt(id), data);
    res.status(200).json(recursoActualizado);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para eliminar un recurso académico.
 */
export const deleteRecursoAcademico = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    await eliminarRecursoAcademico(parseInt(id));
    res.status(200).json({ message: "Recurso académico eliminado correctamente." });
  } catch (error) {
    next(error);
  }
};
