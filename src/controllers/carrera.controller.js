import {
    obtenerCarreras,
    obtenerCarreraPorId,
    crearCarrera,
    actualizarCarrera,
    eliminarCarrera,
  } from "../services/carrera.service.js";
  
  /**
   * Controlador para obtener todas las carreras.
   */
  export const getCarreras = async (req, res, next) => {
    try {
      const carreras = await obtenerCarreras();
      res.json(carreras);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener una carrera por ID.
   */
  export const getCarreraById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const carrera = await obtenerCarreraPorId(id);
  
      if (!carrera) {
        return res.status(404).json({ message: "Carrera no encontrada" });
      }
  
      res.json(carrera);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear una nueva carrera.
   */
  export const createCarrera = async (req, res, next) => {
    try {
      const { Nombre, Descripcion, Perfil_egresado, Oportunidades_prof } = req.body;
      const nuevaCarrera = await crearCarrera({
        Nombre,
        Descripcion,
        Perfil_egresado,
        Oportunidades_prof,
      });
  
      res.status(201).json(nuevaCarrera);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar una carrera.
   */
  export const updateCarrera = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      const carreraActualizada = await actualizarCarrera(id, data);
      res.json(carreraActualizada);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar una carrera.
   */
  export const deleteCarrera = async (req, res, next) => {
    try {
      const { id } = req.params;
      await eliminarCarrera(id);
      res.json({ message: "Carrera eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  };
  