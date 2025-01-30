import {
    obtenerHistorialesAcademicos,
    obtenerHistorialAcademicoPorId,
    crearHistorialAcademico,
    actualizarHistorialAcademico,
    eliminarHistorialAcademico
  } from "../services/historialAcademico.service.js";
  
  /**
   * Controlador para obtener todos los registros de historial académico.
   */
  export const getHistorialesAcademicos = async (req, res, next) => {
    try {
      const historiales = await obtenerHistorialesAcademicos();
      res.status(200).json(historiales);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener un historial académico por ID.
   */
  export const getHistorialAcademicoById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido." });
  
      const historial = await obtenerHistorialAcademicoPorId(parseInt(id));
      res.status(200).json(historial);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para registrar un historial académico.
   */
  export const createHistorialAcademico = async (req, res, next) => {
    try {
      const { Fecha_inicio, Fecha_fin, Estado, idCarrera, idPersona } = req.body;
      const nuevoHistorial = await crearHistorialAcademico({ Fecha_inicio, Fecha_fin, Estado, idCarrera, idPersona });
      res.status(201).json(nuevoHistorial);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar un historial académico.
   */
  export const updateHistorialAcademico = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido." });
  
      const historialActualizado = await actualizarHistorialAcademico(parseInt(id), data);
      res.status(200).json(historialActualizado);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar un historial académico.
   */
  export const deleteHistorialAcademico = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido." });
  
      await eliminarHistorialAcademico(parseInt(id));
      res.status(200).json({ message: "Historial académico eliminado correctamente." });
    } catch (error) {
      next(error);
    }
  };
  