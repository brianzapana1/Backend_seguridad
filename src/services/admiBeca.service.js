import { db as prisma } from "../config/database.js";

/**
 * Obtiene todas las becas con información de la carrera asociada.
 */
export const obtenerBecas = async () => {
  try {
    const becas = await prisma.admiBeca.findMany({
      include: {
        Carrera: {
          select: { Nombre: true }
        }
      }
    });

    if (!becas.length) {
      throw new Error("No hay becas registradas.");
    }

    return becas;
  } catch (error) {
    throw new Error(`Error al obtener las becas: ${error.message}`);
  }
};

/**
 * Obtiene una beca por su ID.
 */
export const obtenerBecaPorId = async (idAdmiBeca) => {
  try {
    const beca = await prisma.admiBeca.findUnique({
      where: { idAdmiBeca: parseInt(idAdmiBeca) },
      include: {
        Carrera: {
          select: { Nombre: true }
        }
      }
    });

    if (!beca) {
      throw new Error("La beca no existe.");
    }

    return beca;
  } catch (error) {
    throw new Error(`Error al obtener la beca: ${error.message}`);
  }
};

/**
 * Crea una nueva beca.
 */
export const crearBeca = async (data) => {
  try {
    const { Nombre, Descripcion, Requisitos, idCarrera } = data;

    if (!Nombre || !Descripcion || !Requisitos || !idCarrera) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si la carrera existe
    const carrera = await prisma.carrera.findUnique({ where: { idCarrera } });

    if (!carrera) {
      throw new Error("La carrera especificada no existe.");
    }

    const nuevaBeca = await prisma.admiBeca.create({
      data: {
        Nombre,
        Descripcion,
        Requisitos,
        idCarrera
      }
    });

    return nuevaBeca;
  } catch (error) {
    throw new Error(`Error al crear la beca: ${error.message}`);
  }
};

/**
 * Actualiza una beca.
 */
export const actualizarBeca = async (idAdmiBeca, data) => {
  try {
    const becaExistente = await prisma.admiBeca.findUnique({
      where: { idAdmiBeca: parseInt(idAdmiBeca) }
    });

    if (!becaExistente) {
      throw new Error("La beca no existe.");
    }

    const becaActualizada = await prisma.admiBeca.update({
      where: { idAdmiBeca: parseInt(idAdmiBeca) },
      data
    });

    return becaActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la beca: ${error.message}`);
  }
};

/**
 * Elimina una beca por ID.
 */
export const eliminarBeca = async (idAdmiBeca) => {
  try {
    const becaExistente = await prisma.admiBeca.findUnique({
      where: { idAdmiBeca: parseInt(idAdmiBeca) }
    });

    if (!becaExistente) {
      throw new Error("La beca no existe.");
    }

    await prisma.admiBeca.delete({
      where: { idAdmiBeca: parseInt(idAdmiBeca) }
    });

    return { message: "Beca eliminada correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar la beca: ${error.message}`);
  }
};
