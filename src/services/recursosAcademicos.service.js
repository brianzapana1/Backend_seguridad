import { db as prisma } from "../config/database.js";

/**
 * Obtiene todos los recursos académicos con información del usuario que lo subió.
 */
export const obtenerRecursosAcademicos = async () => {
  try {
    const recursos = await prisma.recursosAcademicos.findMany({
      include: {
        Usuario: {
          select: { Nombre_usuario: true } // Solo obtenemos el nombre del usuario
        }
      }
    });

    if (!recursos.length) {
      throw new Error("No hay recursos académicos registrados.");
    }

    return recursos;
  } catch (error) {
    throw new Error(`Error al obtener recursos académicos: ${error.message}`);
  }
};

/**
 * Obtiene un recurso académico por ID.
 */
export const obtenerRecursoPorId = async (idRecurso) => {
  try {
    const recurso = await prisma.recursosAcademicos.findUnique({
      where: { idRecurso: parseInt(idRecurso) },
      include: {
        Usuario: {
          select: { Nombre_usuario: true }
        }
      }
    });

    if (!recurso) {
      throw new Error("El recurso académico no existe.");
    }

    return recurso;
  } catch (error) {
    throw new Error(`Error al obtener el recurso académico: ${error.message}`);
  }
};

/**
 * Crea un nuevo recurso académico.
 */
export const crearRecursoAcademico = async (data) => {
  try {
    const { idUsuario, Titulo, Autor, Tipo, Categoria, Portada, Archivo } = data;

    if (!idUsuario || !Titulo || !Autor || !Tipo || !Categoria || !Archivo) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { idUsuario } });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    const nuevoRecurso = await prisma.recursosAcademicos.create({
      data: {
        idUsuario,
        Titulo,
        Autor,
        Tipo,
        Categoria,
        Portada: Portada || null,
        Archivo
      }
    });

    return nuevoRecurso;
  } catch (error) {
    throw new Error(`Error al crear el recurso académico: ${error.message}`);
  }
};

/**
 * Actualiza un recurso académico.
 */
export const actualizarRecursoAcademico = async (idRecurso, data) => {
  try {
    const recursoExistente = await prisma.recursosAcademicos.findUnique({
      where: { idRecurso: parseInt(idRecurso) }
    });

    if (!recursoExistente) {
      throw new Error("El recurso académico no existe.");
    }

    const recursoActualizado = await prisma.recursosAcademicos.update({
      where: { idRecurso: parseInt(idRecurso) },
      data
    });

    return recursoActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar el recurso académico: ${error.message}`);
  }
};

/**
 * Elimina un recurso académico por ID.
 */
export const eliminarRecursoAcademico = async (idRecurso) => {
  try {
    const recursoExistente = await prisma.recursosAcademicos.findUnique({
      where: { idRecurso: parseInt(idRecurso) }
    });

    if (!recursoExistente) {
      throw new Error("El recurso académico no existe.");
    }

    await prisma.recursosAcademicos.delete({
      where: { idRecurso: parseInt(idRecurso) }
    });

    return { message: "Recurso académico eliminado correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar el recurso académico: ${error.message}`);
  }
};
