import {
    obtenerBeneficiarios,
    obtenerBeneficiarioPorId,
    crearBeneficiario,
    actualizarBeneficiario,
    eliminarBeneficiario
  } from "../services/beneficiariosBeca.service.js";
  
  /**
   * Controlador para obtener todos los beneficiarios de beca.
   */
  export const getBeneficiarios = async (req, res, next) => {
    try {
      const beneficiarios = await obtenerBeneficiarios();
      res.status(200).json(beneficiarios);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener un beneficiario de beca por ID.
   */
  export const getBeneficiarioById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido." });
  
      const beneficiario = await obtenerBeneficiarioPorId(parseInt(id));
      res.status(200).json(beneficiario);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para asignar una beca a una persona.
   */
  export const createBeneficiario = async (req, res, next) => {
    try {
      const { idAdmiBeca, idPersona } = req.body;
      const nuevoBeneficiario = await crearBeneficiario({ idAdmiBeca, idPersona });
      res.status(201).json(nuevoBeneficiario);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar un beneficiario de beca.
   */
  export const updateBeneficiario = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido." });
  
      const beneficiarioActualizado = await actualizarBeneficiario(parseInt(id), data);
      res.status(200).json(beneficiarioActualizado);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar un beneficiario de beca.
   */
  export const deleteBeneficiario = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido." });
  
      await eliminarBeneficiario(parseInt(id));
      res.status(200).json({ message: "Beneficiario eliminado correctamente." });
    } catch (error) {
      next(error);
    }
  };
  