import { db as prisma } from "../config/database.js";

/**
 * Obtiene todas las actividades con información del usuario que las creó.
 */
export const obtenerActividades = async () => {
  try {
    const actividades = await prisma.actividades.findMany({
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!actividades.length) {
      throw new Error("No hay actividades registradas.");
    }

    return actividades;
  } catch (error) {
    throw new Error(`Error al obtener actividades: ${error.message}`);
  }
};

/**
 * Obtiene una actividad por ID.
 */
export const obtenerActividadPorId = async (idActividad) => {
  try {
    const actividad = await prisma.actividades.findUnique({
      where: { idActividad: parseInt(idActividad) },
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!actividad) {
      throw new Error("La actividad no existe.");
    }

    return actividad;
  } catch (error) {
    throw new Error(`Error al obtener la actividad: ${error.message}`);
  }
};

/**
 * Crea una nueva actividad.
 */
export const crearActividad = async (data) => {
  try {
    const { idUsuario, Titulo, Descripcion, Fecha_inicio, Fecha_fin, Tipo } = data;

    if (!idUsuario || !Titulo || !Descripcion || !Fecha_inicio || !Fecha_fin || !Tipo) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { idUsuario } });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    const nuevaActividad = await prisma.actividades.create({
      data: {
        idUsuario,
        Titulo,
        Descripcion,
        Fecha_inicio: new Date(Fecha_inicio),
        Fecha_fin: new Date(Fecha_fin),
        Tipo
      }
    });

    return nuevaActividad;
  } catch (error) {
    throw new Error(`Error al crear la actividad: ${error.message}`);
  }
};

/**
 * Actualiza una actividad.
 */
export const actualizarActividad = async (idActividad, data) => {
  try {
    const actividadExistente = await prisma.actividades.findUnique({
      where: { idActividad: parseInt(idActividad) }
    });

    if (!actividadExistente) {
      throw new Error("La actividad no existe.");
    }

    const actividadActualizada = await prisma.actividades.update({
      where: { idActividad: parseInt(idActividad) },
      data
    });

    return actividadActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la actividad: ${error.message}`);
  }
};

/**
 * Elimina una actividad por ID.
 */
export const eliminarActividad = async (idActividad) => {
  try {
    const actividadExistente = await prisma.actividades.findUnique({
      where: { idActividad: parseInt(idActividad) }
    });

    if (!actividadExistente) {
      throw new Error("La actividad no existe.");
    }

    await prisma.actividades.delete({
      where: { idActividad: parseInt(idActividad) }
    });

    return { message: "Actividad eliminada correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar la actividad: ${error.message}`);
  }
};
