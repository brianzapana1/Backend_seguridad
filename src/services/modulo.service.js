import { db as prisma } from "../config/database.js";

/**
 * Obtiene todos los módulos.
 */
export const obtenerModulos = async () => {
  try {
    return await prisma.modulo.findMany({
      include: {
        Permisos: true, // Relación con permisos
      },
    });
  } catch (error) {
    throw new Error("Error al obtener los módulos: " + error.message);
  }
};

/**
 * Obtiene un módulo por ID.
 */
export const obtenerModuloPorId = async (idModulo) => {
  try {
    const modulo = await prisma.modulo.findUnique({
      where: { idModulo: parseInt(idModulo) },
      include: {
        Permisos: true,
      },
    });

    if (!modulo) {
      throw new Error("Módulo no encontrado.");
    }

    return modulo;
  } catch (error) {
    throw new Error("Error al obtener el módulo: " + error.message);
  }
};

/**
 * Crea un nuevo módulo.
 */
export const crearModulo = async (data) => {
  try {
    // Verificar si el nombre ya está en uso
    const moduloExistente = await prisma.modulo.findUnique({
      where: { Nombre: data.Nombre },
    });

    if (moduloExistente) {
      throw new Error("El nombre del módulo ya está en uso.");
    }

    return await prisma.modulo.create({ data });
  } catch (error) {
    throw new Error("Error al crear el módulo: " + error.message);
  }
};

/**
 * Actualiza un módulo por ID.
 */
export const actualizarModulo = async (idModulo, data) => {
  try {
    // Verificar si el módulo existe
    const moduloExistente = await prisma.modulo.findUnique({
      where: { idModulo: parseInt(idModulo) },
    });

    if (!moduloExistente) {
      throw new Error("Módulo no encontrado.");
    }

    return await prisma.modulo.update({
      where: { idModulo: parseInt(idModulo) },
      data,
    });
  } catch (error) {
    throw new Error("Error al actualizar el módulo: " + error.message);
  }
};

/**
 * Elimina un módulo por ID.
 */
export const eliminarModulo = async (idModulo) => {
  try {
    // Verificar si el módulo existe
    const moduloExistente = await prisma.modulo.findUnique({
      where: { idModulo: parseInt(idModulo) },
    });

    if (!moduloExistente) {
      throw new Error("Módulo no encontrado.");
    }

    await prisma.modulo.delete({
      where: { idModulo: parseInt(idModulo) },
    });

    return { message: "Módulo eliminado correctamente." };
  } catch (error) {
    throw new Error("Error al eliminar el módulo: " + error.message);
  }
};
