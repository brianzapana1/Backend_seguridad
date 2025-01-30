import { db as prisma } from "../config/database.js";

/**
 * Obtiene todos los registros de historial académico.
 */
export const obtenerHistorialesAcademicos = async () => {
  try {
    const historiales = await prisma.historialAcademico.findMany({
      include: {
        Carrera: { select: { Nombre: true } },
        Persona: { select: { Nombre: true, Apellido_Paterno: true, Apellido_Materno: true } },
      },
    });

    if (!historiales.length) {
      throw new Error("No hay registros de historial académico.");
    }

    return historiales;
  } catch (error) {
    throw new Error(`Error al obtener el historial académico: ${error.message}`);
  }
};

/**
 * Obtiene un historial académico por su ID.
 */
export const obtenerHistorialAcademicoPorId = async (idHistorial) => {
  try {
    const historial = await prisma.historialAcademico.findUnique({
      where: { idHistorial: parseInt(idHistorial) },
      include: {
        Carrera: { select: { Nombre: true } },
        Persona: { select: { Nombre: true, Apellido_Paterno: true, Apellido_Materno: true } },
      },
    });

    if (!historial) {
      throw new Error("El historial académico no existe.");
    }

    return historial;
  } catch (error) {
    throw new Error(`Error al obtener el historial académico: ${error.message}`);
  }
};

/**
 * Crea un nuevo registro de historial académico.
 */
export const crearHistorialAcademico = async (data) => {
  try {
    const { Fecha_inicio, Fecha_fin, Estado, idCarrera, idPersona } = data;

    if (!Fecha_inicio || !Fecha_fin || !Estado || !idCarrera || !idPersona) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si la carrera y la persona existen
    const carrera = await prisma.carrera.findUnique({ where: { idCarrera } });
    const persona = await prisma.persona.findUnique({ where: { idPersona } });

    if (!carrera) {
      throw new Error("La carrera especificada no existe.");
    }

    if (!persona) {
      throw new Error("La persona especificada no existe.");
    }

    return await prisma.historialAcademico.create({ data });
  } catch (error) {
    throw new Error(`Error al crear el historial académico: ${error.message}`);
  }
};

/**
 * Actualiza un historial académico por ID.
 */
export const actualizarHistorialAcademico = async (idHistorial, data) => {
  try {
    const historialExistente = await prisma.historialAcademico.findUnique({
      where: { idHistorial: parseInt(idHistorial) },
    });

    if (!historialExistente) {
      throw new Error("El historial académico no existe.");
    }

    return await prisma.historialAcademico.update({
      where: { idHistorial: parseInt(idHistorial) },
      data,
    });
  } catch (error) {
    throw new Error(`Error al actualizar el historial académico: ${error.message}`);
  }
};

/**
 * Elimina un historial académico por ID.
 */
export const eliminarHistorialAcademico = async (idHistorial) => {
  try {
    const historialExistente = await prisma.historialAcademico.findUnique({
      where: { idHistorial: parseInt(idHistorial) },
    });

    if (!historialExistente) {
      throw new Error("El historial académico no existe.");
    }

    await prisma.historialAcademico.delete({
      where: { idHistorial: parseInt(idHistorial) },
    });

    return { message: "Historial académico eliminado correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar el historial académico: ${error.message}`);
  }
};
