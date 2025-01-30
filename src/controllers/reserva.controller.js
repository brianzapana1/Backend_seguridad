import {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    actualizarReserva,
    eliminarReserva
  } from "../services/reserva.service.js";
  
  /**
   * Controlador para obtener todas las reservas.
   */
  export const getReservas = async (req, res, next) => {
    try {
      const reservas = await obtenerReservas();
      res.status(200).json(reservas);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para obtener una reserva por ID.
   */
  export const getReservaById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const reserva = await obtenerReservaPorId(parseInt(id));
      res.status(200).json(reserva);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para crear una nueva reserva.
   */
  export const createReserva = async (req, res, next) => {
    try {
      const { idUsuarioRes, idRecurso, Fecha_reserva } = req.body;
  
      const nuevaReserva = await crearReserva({
        idUsuarioRes,
        idRecurso,
        Fecha_reserva
      });
  
      res.status(201).json(nuevaReserva);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para actualizar una reserva.
   */
  export const updateReserva = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      const reservaActualizada = await actualizarReserva(parseInt(id), data);
      res.status(200).json(reservaActualizada);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Controlador para eliminar una reserva.
   */
  export const deleteReserva = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
      }
  
      await eliminarReserva(parseInt(id));
      res.status(200).json({ message: "Reserva eliminada correctamente." });
    } catch (error) {
      next(error);
    }
  };
  