import { db as prisma } from "../config/database.js";

export const authorize = (idModulo, accion) => {
  return async (req, res, next) => {
    try {
      const { userId } = req;
      console.log(`🔍 Verificando permisos - Usuario ID: ${userId} - Módulo ID: ${idModulo} - Acción: ${accion}`);

      if (!userId) {
        console.warn("⚠️ Usuario no autenticado.");
        return res.status(401).json({ message: "Usuario no autenticado." });
      }

      // Buscar el rol del usuario en UsuarioRol
      const usuarioRol = await prisma.usuarioRol.findFirst({
        where: { idUsuario: userId },
        include: { Rol: true },
      });

      if (!usuarioRol) {
        console.warn(`🚫 Usuario ${userId} no tiene un rol asignado.`);
        return res.status(403).json({ message: "No tienes un rol asignado." });
      }

      // Si el usuario es Admin, acceso total
      if (usuarioRol.Rol.Nombre === "Admin") {
        console.log(`✅ Acceso concedido: Usuario Admin (ID: ${userId})`);
        return next();
      }

      // Buscar permisos en la tabla `Permisos`
      const permiso = await prisma.permisos.findFirst({
        where: {
          idUsuarioRol: usuarioRol.idUsuarioRol,
          idModulo: idModulo,
        },
      });

      if (!permiso) {
        console.warn(`🚫 Usuario ${userId} no tiene permisos en este módulo.`);
        return res.status(403).json({ message: "No tienes permisos para acceder a este módulo." });
      }

      if (!permiso[accion]) {
        console.warn(`🚫 Usuario ${userId} no puede realizar ${accion} en el módulo ${idModulo}`);
        return res.status(403).json({ message: `No tienes permisos para ${accion} en este módulo.` });
      }

      console.log(`✅ Acceso concedido: Usuario ${userId} puede realizar ${accion} en el módulo ${idModulo}`);
      next();
    } catch (error) {
      console.error("❌ Error en autorización:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  };
};
