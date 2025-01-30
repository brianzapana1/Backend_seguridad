import { db as prisma } from "../config/database.js";

/**
 * Obtiene todas las noticias con información del usuario que la creó.
 */
export const obtenerNoticias = async () => {
  try {
    const noticias = await prisma.noticias.findMany({
      include: {
        Usuario: {
          select: { Nombre_usuario: true } // Solo obtenemos el nombre del usuario
        }
      }
    });

    if (!noticias.length) {
      throw new Error("No hay noticias registradas.");
    }

    return noticias;
  } catch (error) {
    throw new Error(`Error al obtener noticias: ${error.message}`);
  }
};

/**
 * Obtiene una noticia por ID.
 */
export const obtenerNoticiaPorId = async (idNoticia) => {
  try {
    const noticia = await prisma.noticias.findUnique({
      where: { idNoticia: parseInt(idNoticia) },
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!noticia) {
      throw new Error("La noticia no existe.");
    }

    return noticia;
  } catch (error) {
    throw new Error(`Error al obtener la noticia: ${error.message}`);
  }
};

/**
 * Crea una nueva noticia.
 */
export const crearNoticia = async (data) => {
  try {
    const { idUsuario, Titulo, Contenido, Fecha_publicacion, Categoria, Imagen, Autor } = data;

    if (!idUsuario || !Titulo || !Contenido || !Fecha_publicacion || !Categoria || !Autor) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { idUsuario } });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    const nuevaNoticia = await prisma.noticias.create({
      data: {
        idUsuario,
        Titulo,
        Contenido,
        Fecha_publicacion: new Date(Fecha_publicacion),
        Categoria,
        Imagen: Imagen || null,
        Autor
      }
    });

    return nuevaNoticia;
  } catch (error) {
    throw new Error(`Error al crear la noticia: ${error.message}`);
  }
};

/**
 * Actualiza una noticia.
 */
export const actualizarNoticia = async (idNoticia, data) => {
  try {
    const noticiaExistente = await prisma.noticias.findUnique({
      where: { idNoticia: parseInt(idNoticia) }
    });

    if (!noticiaExistente) {
      throw new Error("La noticia no existe.");
    }

    const noticiaActualizada = await prisma.noticias.update({
      where: { idNoticia: parseInt(idNoticia) },
      data
    });

    return noticiaActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la noticia: ${error.message}`);
  }
};

/**
 * Elimina una noticia por ID.
 */
export const eliminarNoticia = async (idNoticia) => {
  try {
    const noticiaExistente = await prisma.noticias.findUnique({
      where: { idNoticia: parseInt(idNoticia) }
    });

    if (!noticiaExistente) {
      throw new Error("La noticia no existe.");
    }

    await prisma.noticias.delete({
      where: { idNoticia: parseInt(idNoticia) }
    });

    return { message: "Noticia eliminada correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar la noticia: ${error.message}`);
  }
};
