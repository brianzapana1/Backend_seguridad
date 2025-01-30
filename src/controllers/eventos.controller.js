import {
    obtenerEventos,
    obtenerEventoPorId,
    crearEvento,
    actualizarEvento,
    eliminarEvento
  } from "../services/eventos.service.js";
  
  /**
   * Controlador para obtener todos los eventos.
   */
  export const getEventos = async (req, res, next) => {
    try {
      const eventos = await obtenerEventos();
      res.status(200).json(eventos);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener un evento por ID.
   */
  export const getEventoById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const evento = await obtenerEventoPorId(parseInt(id));
      res.status(200).json(evento);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear un nuevo evento.
   */
  export const createEvento = async (req, res, next) => {
    try {
      const { idUsuario, Titulo, Descripcion, FechaInicio, FechaFin, Categoria } = req.body;
  
      const nuevoEvento = await crearEvento({
        idUsuario,
        Titulo,
        Descripcion,
        FechaInicio,
        FechaFin,
        Categoria
      });
  
      res.status(201).json(nuevoEvento);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar un evento.
   */
  export const updateEvento = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const eventoActualizado = await actualizarEvento(parseInt(id), data);
      res.status(200).json(eventoActualizado);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar un evento.
   */
  export const deleteEvento = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      await eliminarEvento(parseInt(id));
      res.status(200).json({ message: "Evento eliminado correctamente." });
    } catch (error) {
      next(error);
    }
  };
  