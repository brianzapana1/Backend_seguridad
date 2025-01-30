import { db as prisma } from "../config/database.js";

/**
 * Obtiene todos los blogs con información del usuario que lo creó.
 */
export const obtenerBlogs = async () => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        Usuario: {
          select: { Nombre_usuario: true } // Solo obtenemos el nombre del usuario
        }
      }
    });

    if (!blogs.length) {
      throw new Error("No hay blogs registrados.");
    }

    return blogs;
  } catch (error) {
    throw new Error(`Error al obtener blogs: ${error.message}`);
  }
};

/**
 * Obtiene un blog por ID.
 */
export const obtenerBlogPorId = async (idBlog) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { idBlog: parseInt(idBlog) },
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!blog) {
      throw new Error("El blog no existe.");
    }

    return blog;
  } catch (error) {
    throw new Error(`Error al obtener el blog: ${error.message}`);
  }
};

/**
 * Crea un nuevo blog.
 */
export const crearBlog = async (data) => {
  try {
    const { idUsuario, Titulo, Contenido, Fecha_publicacion, Categoria } = data;

    if (!idUsuario || !Titulo || !Contenido || !Fecha_publicacion || !Categoria) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { idUsuario } });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    const nuevoBlog = await prisma.blog.create({
      data: {
        idUsuario,
        Titulo,
        Contenido,
        Fecha_publicacion: new Date(Fecha_publicacion),
        Categoria
      }
    });

    return nuevoBlog;
  } catch (error) {
    throw new Error(`Error al crear el blog: ${error.message}`);
  }
};

/**
 * Actualiza un blog.
 */
export const actualizarBlog = async (idBlog, data) => {
  try {
    const blogExistente = await prisma.blog.findUnique({
      where: { idBlog: parseInt(idBlog) }
    });

    if (!blogExistente) {
      throw new Error("El blog no existe.");
    }

    const blogActualizado = await prisma.blog.update({
      where: { idBlog: parseInt(idBlog) },
      data
    });

    return blogActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar el blog: ${error.message}`);
  }
};

/**
 * Elimina un blog por ID.
 */
export const eliminarBlog = async (idBlog) => {
  try {
    const blogExistente = await prisma.blog.findUnique({
      where: { idBlog: parseInt(idBlog) }
    });

    if (!blogExistente) {
      throw new Error("El blog no existe.");
    }

    await prisma.blog.delete({
      where: { idBlog: parseInt(idBlog) }
    });

    return { message: "Blog eliminado correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar el blog: ${error.message}`);
  }
};
