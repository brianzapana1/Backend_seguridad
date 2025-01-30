import { db as prisma } from "../config/database.js";

/**
 * Obtiene todos los beneficiarios de beca con información de la beca y la persona asociada.
 */
export const obtenerBeneficiarios = async () => {
  try {
    const beneficiarios = await prisma.beneficiariosBeca.findMany({
      include: {
        AdmiBeca: { select: { Nombre: true } },
        Persona: { select: { Nombre: true, Apellido_Paterno: true, Apellido_Materno: true } },
      },
    });

    if (!beneficiarios.length) {
      throw new Error("No hay beneficiarios registrados.");
    }

    return beneficiarios;
  } catch (error) {
    throw new Error(`Error al obtener los beneficiarios: ${error.message}`);
  }
};

/**
 * Obtiene un beneficiario de beca por su ID.
 */
export const obtenerBeneficiarioPorId = async (idBeneficiario) => {
  try {
    const beneficiario = await prisma.beneficiariosBeca.findUnique({
      where: { idBeneficiario: parseInt(idBeneficiario) },
      include: {
        AdmiBeca: { select: { Nombre: true } },
        Persona: { select: { Nombre: true, Apellido_Paterno: true, Apellido_Materno: true } },
      },
    });

    if (!beneficiario) {
      throw new Error("El beneficiario no existe.");
    }

    return beneficiario;
  } catch (error) {
    throw new Error(`Error al obtener el beneficiario: ${error.message}`);
  }
};

/**
 * Crea un nuevo beneficiario de beca.
 */
export const crearBeneficiario = async (data) => {
  try {
    const { idAdmiBeca, idPersona } = data;

    if (!idAdmiBeca || !idPersona) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si la beca y la persona existen
    const beca = await prisma.admiBeca.findUnique({ where: { idAdmiBeca } });
    const persona = await prisma.persona.findUnique({ where: { idPersona } });

    if (!beca) {
      throw new Error("La beca especificada no existe.");
    }

    if (!persona) {
      throw new Error("La persona especificada no existe.");
    }

    // Verificar si la persona ya tiene la beca asignada
    const beneficiarioExistente = await prisma.beneficiariosBeca.findFirst({
      where: { idAdmiBeca, idPersona }
    });

    if (beneficiarioExistente) {
      throw new Error("La persona ya es beneficiaria de esta beca.");
    }

    return await prisma.beneficiariosBeca.create({ data });
  } catch (error) {
    throw new Error(`Error al asignar la beca: ${error.message}`);
  }
};

/**
 * Actualiza un beneficiario de beca por ID.
 */
export const actualizarBeneficiario = async (idBeneficiario, data) => {
  try {
    const beneficiarioExistente = await prisma.beneficiariosBeca.findUnique({
      where: { idBeneficiario: parseInt(idBeneficiario) },
    });

    if (!beneficiarioExistente) {
      throw new Error("El beneficiario no existe.");
    }

    return await prisma.beneficiariosBeca.update({
      where: { idBeneficiario: parseInt(idBeneficiario) },
      data,
    });
  } catch (error) {
    throw new Error(`Error al actualizar el beneficiario: ${error.message}`);
  }
};

/**
 * Elimina un beneficiario de beca por ID.
 */
export const eliminarBeneficiario = async (idBeneficiario) => {
  try {
    const beneficiarioExistente = await prisma.beneficiariosBeca.findUnique({
      where: { idBeneficiario: parseInt(idBeneficiario) },
    });

    if (!beneficiarioExistente) {
      throw new Error("El beneficiario no existe.");
    }

    await prisma.beneficiariosBeca.delete({
      where: { idBeneficiario: parseInt(idBeneficiario) },
    });

    return { message: "Beneficiario eliminado correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar el beneficiario: ${error.message}`);
  }
};
