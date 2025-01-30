import {
    obtenerModulos,
    obtenerModuloPorId,
    crearModulo,
    actualizarModulo,
    eliminarModulo,
  } from "../services/modulo.service.js";
  
  /**
   * Controlador para obtener todos los módulos.
   */
  export const getModulos = async (req, res, next) => {
    try {
      const modulos = await obtenerModulos();
      res.json(modulos);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener un módulo por ID.
   */
  export const getModuloById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const modulo = await obtenerModuloPorId(id);
  
      if (!modulo) {
        return res.status(404).json({ message: "Módulo no encontrado" });
      }
  
      res.json(modulo);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear un nuevo módulo.
   */
  export const createModulo = async (req, res, next) => {
    try {
      const { Nombre, Descripcion, Activo } = req.body;
  
      if (!Nombre || !Descripcion) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }
  
      const nuevoModulo = await crearModulo({ Nombre, Descripcion, Activo });
  
      res.status(201).json(nuevoModulo);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar un módulo.
   */
  export const updateModulo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      const moduloActualizado = await actualizarModulo(id, data);
      res.json(moduloActualizado);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar un módulo.
   */
  export const deleteModulo = async (req, res, next) => {
    try {
      const { id } = req.params;
      await eliminarModulo(id);
      res.json({ message: "Módulo eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  };
  