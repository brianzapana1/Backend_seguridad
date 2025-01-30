import {
    obtenerBlogs,
    obtenerBlogPorId,
    crearBlog,
    actualizarBlog,
    eliminarBlog
  } from "../services/blog.service.js";
  
  /**
   * Controlador para obtener todos los blogs.
   */
  export const getBlogs = async (req, res, next) => {
    try {
      const blogs = await obtenerBlogs();
      res.status(200).json(blogs);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener un blog por ID.
   */
  export const getBlogById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const blog = await obtenerBlogPorId(parseInt(id));
      res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear un nuevo blog.
   */
  export const createBlog = async (req, res, next) => {
    try {
      const { idUsuario, Titulo, Contenido, Fecha_publicacion, Categoria } = req.body;
  
      const nuevoBlog = await crearBlog({
        idUsuario,
        Titulo,
        Contenido,
        Fecha_publicacion,
        Categoria
      });
  
      res.status(201).json(nuevoBlog);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar un blog.
   */
  export const updateBlog = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const blogActualizado = await actualizarBlog(parseInt(id), data);
      res.status(200).json(blogActualizado);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar un blog.
   */
  export const deleteBlog = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      await eliminarBlog(parseInt(id));
      res.status(200).json({ message: "Blog eliminado correctamente." });
    } catch (error) {
      next(error);
    }
  };
  