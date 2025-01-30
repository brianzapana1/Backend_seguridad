import { db as prisma } from "../config/database.js";

/**
 * Obtiene todas las relaciones UsuarioRol.
 */
export const obtenerUsuarioRoles = async () => {
  try {
    return await prisma.usuarioRol.findMany({
      include: {
        Usuario: true,
        Rol: true,
        Permisos: true,
      },
    });
  } catch (error) {
    throw new Error("Error al obtener las relaciones Usuario-Rol: " + error.message);
  }
};

/**
 * Obtiene una relación UsuarioRol por ID con validaciones.
 */
export const obtenerUsuarioRolPorId = async (idUsuarioRol) => {
  try {
    if (!idUsuarioRol || isNaN(idUsuarioRol)) {
      throw new Error("El ID del UsuarioRol debe ser un número válido.");
    }

    const usuarioRol = await prisma.usuarioRol.findUnique({
      where: { idUsuarioRol: parseInt(idUsuarioRol) },
      include: {
        Usuario: true,
        Rol: true,
        Permisos: true,
      },
    });

    if (!usuarioRol) {
      throw new Error("Relación Usuario-Rol no encontrada.");
    }

    return usuarioRol;
  } catch (error) {
    throw new Error("Error al obtener la relación Usuario-Rol: " + error.message);
  }
};

/**
 * Asigna un rol a un usuario con validaciones.
 */
export const asignarRolAUsuario = async (idUsuario, idRol) => {
  try {
    if (!idUsuario || isNaN(idUsuario) || !idRol || isNaN(idRol)) {
      throw new Error("Los IDs de usuario y rol deben ser números válidos.");
    }

    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: parseInt(idUsuario) },
    });

    if (!usuario) {
      throw new Error("El usuario especificado no existe.");
    }

    // Verificar si el rol existe
    const rol = await prisma.roles.findUnique({
      where: { idRol: parseInt(idRol) },
    });

    if (!rol) {
      throw new Error("El rol especificado no existe.");
    }

    // Verificar si la relación ya existe
    const usuarioRolExistente = await prisma.usuarioRol.findFirst({
      where: { idUsuario: parseInt(idUsuario), idRol: parseInt(idRol) },
    });

    if (usuarioRolExistente) {
      throw new Error("El usuario ya tiene este rol asignado.");
    }

    return await prisma.usuarioRol.create({
      data: { idUsuario: parseInt(idUsuario), idRol: parseInt(idRol) },
    });
  } catch (error) {
    throw new Error("Error al asignar el rol al usuario: " + error.message);
  }
};

/**
 * Actualiza la relación Usuario-Rol con validaciones.
 */
export const actualizarRolDeUsuario = async (idUsuarioRol, idRol) => {
  try {
    if (!idUsuarioRol || isNaN(idUsuarioRol) || !idRol || isNaN(idRol)) {
      throw new Error("Los IDs deben ser números válidos.");
    }

    const usuarioRolExistente = await prisma.usuarioRol.findUnique({
      where: { idUsuarioRol: parseInt(idUsuarioRol) },
    });

    if (!usuarioRolExistente) {
      throw new Error("Relación Usuario-Rol no encontrada.");
    }

    return await prisma.usuarioRol.update({
      where: { idUsuarioRol: parseInt(idUsuarioRol) },
      data: { idRol: parseInt(idRol) },
    });
  } catch (error) {
    throw new Error("Error al actualizar la relación Usuario-Rol: " + error.message);
  }
};

/**
 * Elimina una relación Usuario-Rol con validaciones.
 */
export const eliminarRolDeUsuario = async (idUsuarioRol) => {
  try {
    if (!idUsuarioRol || isNaN(idUsuarioRol)) {
      throw new Error("El ID del UsuarioRol debe ser un número válido.");
    }

    const usuarioRolExistente = await prisma.usuarioRol.findUnique({
      where: { idUsuarioRol: parseInt(idUsuarioRol) },
    });

    if (!usuarioRolExistente) {
      throw new Error("Relación Usuario-Rol no encontrada.");
    }

    await prisma.usuarioRol.delete({
      where: { idUsuarioRol: parseInt(idUsuarioRol) },
    });

    return { message: "Relación Usuario-Rol eliminada correctamente." };
  } catch (error) {
    throw new Error("Error al eliminar la relación Usuario-Rol: " + error.message);
  }
};
