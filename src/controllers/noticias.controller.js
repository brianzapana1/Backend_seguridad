import {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia
} from "../services/noticias.service.js";

/**
 * Controlador para obtener todas las noticias.
 */
export const getNoticias = async (req, res, next) => {
  try {
    const noticias = await obtenerNoticias();
    res.status(200).json(noticias);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para obtener una noticia por ID.
 */
export const getNoticiaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const noticia = await obtenerNoticiaPorId(parseInt(id));
    res.status(200).json(noticia);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para crear una nueva noticia.
 */
export const createNoticia = async (req, res, next) => {
  try {
    const { idUsuario, Titulo, Contenido, Fecha_publicacion, Categoria, Imagen, Autor } = req.body;

    const nuevaNoticia = await crearNoticia({
      idUsuario,
      Titulo,
      Contenido,
      Fecha_publicacion,
      Categoria,
      Imagen,
      Autor
    });

    res.status(201).json(nuevaNoticia);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para actualizar una noticia.
 */
export const updateNoticia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    const noticiaActualizada = await actualizarNoticia(parseInt(id), data);
    res.status(200).json(noticiaActualizada);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para eliminar una noticia.
 */
export const deleteNoticia = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    await eliminarNoticia(parseInt(id));
    res.status(200).json({ message: "Noticia eliminada correctamente." });
  } catch (error) {
    next(error);
  }
};
