import { db as prisma } from "../config/database.js";

/**
 * Obtiene todos los eventos con información del usuario creador.
 */
export const obtenerEventos = async () => {
  try {
    const eventos = await prisma.eventos.findMany({
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!eventos.length) {
      throw new Error("No hay eventos registrados.");
    }

    return eventos;
  } catch (error) {
    throw new Error(`Error al obtener los eventos: ${error.message}`);
  }
};

/**
 * Obtiene un evento por su ID.
 */
export const obtenerEventoPorId = async (idEvento) => {
  try {
    const evento = await prisma.eventos.findUnique({
      where: { idEvento: parseInt(idEvento) },
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!evento) {
      throw new Error("El evento no existe.");
    }

    return evento;
  } catch (error) {
    throw new Error(`Error al obtener el evento: ${error.message}`);
  }
};

/**
 * Crea un nuevo evento.
 */
export const crearEvento = async (data) => {
  try {
    const { idUsuario, Titulo, Descripcion, FechaInicio, FechaFin, Categoria } = data;

    if (!idUsuario || !Titulo || !Descripcion || !FechaInicio || !FechaFin || !Categoria) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { idUsuario } });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    const nuevoEvento = await prisma.eventos.create({
      data: {
        idUsuario,
        Titulo,
        Descripcion,
        FechaInicio: new Date(FechaInicio),
        FechaFin: new Date(FechaFin),
        Categoria
      }
    });

    return nuevoEvento;
  } catch (error) {
    throw new Error(`Error al crear el evento: ${error.message}`);
  }
};

/**
 * Actualiza un evento.
 */
export const actualizarEvento = async (idEvento, data) => {
  try {
    const eventoExistente = await prisma.eventos.findUnique({
      where: { idEvento: parseInt(idEvento) }
    });

    if (!eventoExistente) {
      throw new Error("El evento no existe.");
    }

    const eventoActualizado = await prisma.eventos.update({
      where: { idEvento: parseInt(idEvento) },
      data
    });

    return eventoActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar el evento: ${error.message}`);
  }
};

/**
 * Elimina un evento por ID.
 */
export const eliminarEvento = async (idEvento) => {
  try {
    const eventoExistente = await prisma.eventos.findUnique({
      where: { idEvento: parseInt(idEvento) }
    });

    if (!eventoExistente) {
      throw new Error("El evento no existe.");
    }

    await prisma.eventos.delete({
      where: { idEvento: parseInt(idEvento) }
    });

    return { message: "Evento eliminado correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar el evento: ${error.message}`);
  }
};
