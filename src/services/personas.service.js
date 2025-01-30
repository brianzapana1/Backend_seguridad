import { db as prisma } from "../config/database.js";

/**
 * Registra una nueva persona en la base de datos.
 * @param {Object} data - Datos de la persona.
 * @returns {Object} - Persona creada con su ID.
 */
export const registrarPersona = async (data) => {
  try {
    // ❌ Evitar que Prisma tome manualmente el `idPersona`
    const { idPersona, ...dataSinId } = data;

    // ✅ Verificar si el correo ya existe
    const personaExistente = await prisma.persona.findUnique({
      where: { Correo: data.Correo },
    });

    if (personaExistente) {
      throw new Error("❌ El correo ya está registrado. Usa otro correo.");
    }

    // ✅ Verificar si la carrera existe antes de asignarla
    if (data.idCarrera) {
      const carreraExistente = await prisma.carrera.findUnique({
        where: { idCarrera: data.idCarrera },
      });

      if (!carreraExistente) {
        throw new Error("❌ La carrera seleccionada no existe.");
      }
    }

    // 🔥 Crear la persona (SIN `idPersona`)
    const nuevaPersona = await prisma.persona.create({
      data: {
        ...dataSinId,
      },
    });

    return nuevaPersona;
  } catch (error) {
    console.error("❌ Error al registrar persona:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Obtiene todas las personas registradas.
 * @returns {Array} - Lista de personas.
 */
export const obtenerPersonas = async () => {
  return await prisma.persona.findMany();
};

/**
 * Obtiene una persona por su ID.
 * @param {number} id - ID de la persona.
 * @returns {Object} - Datos de la persona.
 */
export const obtenerPersonaPorId = async (id) => {
  const personId = parseInt(id, 10);
  if (isNaN(personId)) throw new Error("❌ El ID proporcionado no es válido.");

  const persona = await prisma.persona.findUnique({
    where: { idPersona: personId },
  });

  if (!persona) {
    throw new Error("❌ Persona no encontrada.");
  }

  return persona;
};

/**
 * Edita una persona existente.
 * @param {number} id - ID de la persona.
 * @param {Object} data - Datos actualizados.
 * @returns {Object} - Persona actualizada.
 */
export const editarPersona = async (id, data) => {
  const personId = parseInt(id, 10);
  if (isNaN(personId)) throw new Error("❌ El ID proporcionado no es válido.");

  const existingPerson = await prisma.persona.findUnique({
    where: { idPersona: personId },
  });

  if (!existingPerson) throw new Error("❌ Persona no encontrada.");

  // ✅ Validar si la carrera existe antes de actualizar
  if (data.idCarrera) {
    const carreraExistente = await prisma.carrera.findUnique({
      where: { idCarrera: data.idCarrera },
    });

    if (!carreraExistente) {
      throw new Error("❌ La carrera seleccionada no existe.");
    }
  }

  return await prisma.persona.update({
    where: { idPersona: personId },
    data,
  });
};

/**
 * Elimina una persona por ID.
 * @param {number} id - ID de la persona.
 * @returns {Object} - Mensaje de éxito.
 */
export const eliminarPersona = async (id) => {
  const personId = parseInt(id, 10);
  if (isNaN(personId)) throw new Error("❌ El ID proporcionado no es válido.");

  const existingPerson = await prisma.persona.findUnique({
    where: { idPersona: personId },
  });

  if (!existingPerson) throw new Error("❌ Persona no encontrada.");

  await prisma.persona.delete({ where: { idPersona: personId } });

  return { message: "✅ Persona eliminada exitosamente." };
};
