import {
    obtenerBecas,
    obtenerBecaPorId,
    crearBeca,
    actualizarBeca,
    eliminarBeca
  } from "../services/admiBeca.service.js";
  
  /**
   * Controlador para obtener todas las becas.
   */
  export const getBecas = async (req, res, next) => {
    try {
      const becas = await obtenerBecas();
      res.status(200).json(becas);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener una beca por ID.
   */
  export const getBecaById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const beca = await obtenerBecaPorId(parseInt(id));
      res.status(200).json(beca);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear una nueva beca.
   */
  export const createBeca = async (req, res, next) => {
    try {
      const { Nombre, Descripcion, Requisitos, idCarrera } = req.body;
  
      const nuevaBeca = await crearBeca({
        Nombre,
        Descripcion,
        Requisitos,
        idCarrera
      });
  
      res.status(201).json(nuevaBeca);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar una beca.
   */
  export const updateBeca = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const becaActualizada = await actualizarBeca(parseInt(id), data);
      res.status(200).json(becaActualizada);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar una beca.
   */
  export const deleteBeca = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      await eliminarBeca(parseInt(id));
      res.status(200).json({ message: "Beca eliminada correctamente." });
    } catch (error) {
      next(error);
    }
  };
  