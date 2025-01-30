import {
    obtenerBolsaTrabajo,
    obtenerBolsaTrabajoPorId,
    crearBolsaTrabajo,
    actualizarBolsaTrabajo,
    eliminarBolsaTrabajo
  } from "../services/bolsaTrabajo.service.js";
  
  /**
   * Controlador para obtener todas las ofertas de trabajo.
   */
  export const getBolsaTrabajo = async (req, res, next) => {
    try {
      const bolsaTrabajo = await obtenerBolsaTrabajo();
      res.status(200).json(bolsaTrabajo);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener una oferta de trabajo por ID.
   */
  export const getBolsaTrabajoById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const bolsaTrabajo = await obtenerBolsaTrabajoPorId(parseInt(id));
      res.status(200).json(bolsaTrabajo);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear una nueva oferta de trabajo.
   */
  export const createBolsaTrabajo = async (req, res, next) => {
    try {
      const { idUsuario, Titulo, Descripcion, Fecha_publicacion, Fecha_expiracion } = req.body;
  
      const nuevaBolsaTrabajo = await crearBolsaTrabajo({
        idUsuario,
        Titulo,
        Descripcion,
        Fecha_publicacion,
        Fecha_expiracion
      });
  
      res.status(201).json(nuevaBolsaTrabajo);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar una oferta de trabajo.
   */
  export const updateBolsaTrabajo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const bolsaTrabajoActualizada = await actualizarBolsaTrabajo(parseInt(id), data);
      res.status(200).json(bolsaTrabajoActualizada);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar una oferta de trabajo.
   */
  export const deleteBolsaTrabajo = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      await eliminarBolsaTrabajo(parseInt(id));
      res.status(200).json({ message: "Oferta de trabajo eliminada correctamente." });
    } catch (error) {
      next(error);
    }
  };
  