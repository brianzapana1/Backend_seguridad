import { db as prisma } from "../config/database.js";

/**
 * Obtiene todas las ofertas de la bolsa de trabajo con información del usuario.
 */
export const obtenerBolsaTrabajo = async () => {
  try {
    const bolsaTrabajo = await prisma.bolsaTrabajo.findMany({
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!bolsaTrabajo.length) {
      throw new Error("No hay ofertas de trabajo registradas.");
    }

    return bolsaTrabajo;
  } catch (error) {
    throw new Error(`Error al obtener las ofertas de trabajo: ${error.message}`);
  }
};

/**
 * Obtiene una oferta de trabajo por ID.
 */
export const obtenerBolsaTrabajoPorId = async (idBolsa) => {
  try {
    const bolsaTrabajo = await prisma.bolsaTrabajo.findUnique({
      where: { idBolsa: parseInt(idBolsa) },
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!bolsaTrabajo) {
      throw new Error("La oferta de trabajo no existe.");
    }

    return bolsaTrabajo;
  } catch (error) {
    throw new Error(`Error al obtener la oferta de trabajo: ${error.message}`);
  }
};

/**
 * Crea una nueva oferta de trabajo.
 */
export const crearBolsaTrabajo = async (data) => {
  try {
    const { idUsuario, Titulo, Descripcion, Fecha_publicacion, Fecha_expiracion } = data;

    if (!idUsuario || !Titulo || !Descripcion || !Fecha_publicacion || !Fecha_expiracion) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { idUsuario } });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    const nuevaBolsaTrabajo = await prisma.bolsaTrabajo.create({
      data: {
        idUsuario,
        Titulo,
        Descripcion,
        Fecha_publicacion: new Date(Fecha_publicacion),
        Fecha_expiracion: new Date(Fecha_expiracion)
      }
    });

    return nuevaBolsaTrabajo;
  } catch (error) {
    throw new Error(`Error al crear la oferta de trabajo: ${error.message}`);
  }
};

/**
 * Actualiza una oferta de trabajo.
 */
export const actualizarBolsaTrabajo = async (idBolsa, data) => {
  try {
    const bolsaTrabajoExistente = await prisma.bolsaTrabajo.findUnique({
      where: { idBolsa: parseInt(idBolsa) }
    });

    if (!bolsaTrabajoExistente) {
      throw new Error("La oferta de trabajo no existe.");
    }

    const bolsaTrabajoActualizada = await prisma.bolsaTrabajo.update({
      where: { idBolsa: parseInt(idBolsa) },
      data
    });

    return bolsaTrabajoActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la oferta de trabajo: ${error.message}`);
  }
};

/**
 * Elimina una oferta de trabajo por ID.
 */
export const eliminarBolsaTrabajo = async (idBolsa) => {
  try {
    const bolsaTrabajoExistente = await prisma.bolsaTrabajo.findUnique({
      where: { idBolsa: parseInt(idBolsa) }
    });

    if (!bolsaTrabajoExistente) {
      throw new Error("La oferta de trabajo no existe.");
    }

    await prisma.bolsaTrabajo.delete({
      where: { idBolsa: parseInt(idBolsa) }
    });

    return { message: "Oferta de trabajo eliminada correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar la oferta de trabajo: ${error.message}`);
  }
};
