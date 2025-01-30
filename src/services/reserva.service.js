import { db as prisma } from "../config/database.js";

/**
 * Obtiene todas las reservas con información del usuario y del recurso académico reservado.
 */
export const obtenerReservas = async () => {
  try {
    const reservas = await prisma.reservas.findMany({
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        },
        Recurso: {
          select: { Titulo: true, Tipo: true }
        }
      }
    });

    if (!reservas.length) {
      throw new Error("No hay reservas registradas.");
    }

    return reservas;
  } catch (error) {
    throw new Error(`Error al obtener reservas: ${error.message}`);
  }
};

/**
 * Obtiene una reserva por ID.
 */
export const obtenerReservaPorId = async (idReserva) => {
  try {
    const reserva = await prisma.reservas.findUnique({
      where: { idReserva: parseInt(idReserva) },
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        },
        Recurso: {
          select: { Titulo: true, Tipo: true }
        }
      }
    });

    if (!reserva) {
      throw new Error("La reserva no existe.");
    }

    return reserva;
  } catch (error) {
    throw new Error(`Error al obtener la reserva: ${error.message}`);
  }
};

/**
 * Crea una nueva reserva.
 */
export const crearReserva = async (data) => {
  try {
    const { idUsuarioRes, idRecurso, Fecha_reserva } = data;

    if (!idUsuarioRes || !idRecurso || !Fecha_reserva) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { idUsuario: idUsuarioRes } });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    // Verificar si el recurso existe
    const recurso = await prisma.recursosAcademicos.findUnique({ where: { idRecurso } });

    if (!recurso) {
      throw new Error("El recurso académico especificado no existe.");
    }

    const nuevaReserva = await prisma.reservas.create({
      data: {
        idUsuarioRes,
        idRecurso,
        Fecha_reserva: new Date(Fecha_reserva)
      }
    });

    return nuevaReserva;
  } catch (error) {
    throw new Error(`Error al crear la reserva: ${error.message}`);
  }
};

/**
 * Actualiza una reserva.
 */
export const actualizarReserva = async (idReserva, data) => {
  try {
    const reservaExistente = await prisma.reservas.findUnique({
      where: { idReserva: parseInt(idReserva) }
    });

    if (!reservaExistente) {
      throw new Error("La reserva no existe.");
    }

    const reservaActualizada = await prisma.reservas.update({
      where: { idReserva: parseInt(idReserva) },
      data
    });

    return reservaActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la reserva: ${error.message}`);
  }
};

/**
 * Elimina una reserva por ID.
 */
export const eliminarReserva = async (idReserva) => {
  try {
    const reservaExistente = await prisma.reservas.findUnique({
      where: { idReserva: parseInt(idReserva) }
    });

    if (!reservaExistente) {
      throw new Error("La reserva no existe.");
    }

    await prisma.reservas.delete({
      where: { idReserva: parseInt(idReserva) }
    });

    return { message: "Reserva eliminada correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar la reserva: ${error.message}`);
  }
};
