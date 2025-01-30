import { db as prisma } from "../config/database.js";

/**
 * Obtiene todas las carreras.
 */
export const obtenerCarreras = async () => {
  return await prisma.carrera.findMany();
};

/**
 * Obtiene una carrera por su ID.
 */
export const obtenerCarreraPorId = async (idCarrera) => {
  return await prisma.carrera.findUnique({
    where: { idCarrera: parseInt(idCarrera) },
  });
};

/**
 * Crea una nueva carrera.
 */
export const crearCarrera = async (data) => {
  return await prisma.carrera.create({
    data,
  });
};

/**
 * Actualiza una carrera existente.
 */
export const actualizarCarrera = async (idCarrera, data) => {
  return await prisma.carrera.update({
    where: { idCarrera: parseInt(idCarrera) },
    data,
  });
};

/**
 * Elimina una carrera.
 */
export const eliminarCarrera = async (idCarrera) => {
  return await prisma.carrera.delete({
    where: { idCarrera: parseInt(idCarrera) },
  });
};
