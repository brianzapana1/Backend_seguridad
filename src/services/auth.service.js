import bcrypt from "bcryptjs";
import { db } from "../config/database.js"; 
import { logsDb } from "../config/database.js";
import { generarToken } from "../utils/tokenUtils.js";
import jwt from "jsonwebtoken";
import { registrarIntentoLogin } from "./logsIntentos.service.js";
import dotenv from "dotenv";
import { obtenerFechaBolivia } from "../utils/fechaUtils.js";



/**
 * Registra un evento en la tabla LogsSistema.
 * @param {Object} data - Información del evento.
 * @param {number} data.idUsuario - ID del usuario que realiza la acción.
 * @param {string} data.Tipo_evento - Tipo de evento (LOGIN, LOGIN_FAIL, LOGIN_BLOCKED).
 * @param {string} data.Descripcion - Descripción detallada del evento.
 * @param {string} data.ipUsuario - Dirección IP del usuario.
 * @param {string} data.Nivel - Nivel del evento (INFO, WARN, ERROR).
 */

const verificarCredenciales = async (Nombre_usuario, Contrasenia) => {
  const usuario = await db.Usuario.findUnique({ 
    where: { Nombre_usuario },
    include: {
      UsuarioRol: {
        include: { Rol: true },
      },
    },
  });

  if (!usuario) {
    throw new Error("Credenciales incorrectas");
  }

  const match = await bcrypt.compare(Contrasenia, usuario.Contrasenia);
  if (!match) {
    throw new Error("Credenciales incorrectas");
  }

  return usuario;
};


const obtenerPermisosUsuario = async (idUsuario) => {
  const usuarioRol = await db.UsuarioRol.findFirst({  
    where: { idUsuario },
    include: {
      Rol: true,
      Permisos: {
        include: {
          Modulo: true,
        },
      },
    },
  });

  if (!usuarioRol) {
    throw new Error("El usuario no tiene un rol asignado.");
  }

  const permisos = usuarioRol.Permisos.map((permiso) => ({
    modulo: permiso.Modulo.Nombre,
    permisos: {
      crear: permiso.Crear,
      actualizar: permiso.Actualizar,
      eliminar: permiso.Eliminar,
      leer: permiso.Leer,
      reportes: permiso.Reportes,
    },
  }));

  return {
    rol: usuarioRol.Rol.Nombre,
    permisos,
  };
};


export const loginUsuario = async (Nombre_usuario, Contrasenia, ipUsuario) => {
  try {
    // 📌 Obtener la fecha en la zona horaria de Bolivia correctamente
    const fechaBolivia = obtenerFechaBolivia();

    const usuario = await db.Usuario.findUnique({
      where: { Nombre_usuario },
      include: {
        UsuarioRol: {
          include: {
            Rol: true,
            Permisos: { include: { Modulo: true } },
          },
        },
      },
    });

    if (!usuario) {
      await registrarIntentoLogin(null, ipUsuario, false, "Usuario no encontrado", 1);

      await logsDb.logs_Sistema.create({
        data: {
          idUsuario: "Usuario desconocido",
          Tipo_evento: "LOGIN_FALLIDO",
          Descripcion: `Intento de inicio de sesión fallido para un usuario no registrado.`,
          ipUsuario: ipUsuario || "0.0.0.0",
          Nivel: "ADVERTENCIA",
          Fecha: obtenerFechaBolivia(), // 📌 Fecha corregida a Bolivia UTC-4
        },
      });

      throw new Error("Credenciales incorrectas.");
    }

    if (usuario.Bloqueado) {
      console.log(`Usuario bloqueado detectado: ${usuario.Nombre_usuario}`);

      const ultimoIntento = await logsDb.logs_Intentos_Login.findFirst({
        where: { idUsuario: usuario.Nombre_usuario },
        orderBy: { Fecha_intento: "desc" },
      });

      if (ultimoIntento) {
        const tiempoBloqueo = new Date(ultimoIntento.Fecha_intento);
        tiempoBloqueo.setSeconds(tiempoBloqueo.getSeconds() + 20);

        if (new Date() > tiempoBloqueo) {
          console.log("Usuario desbloqueado automáticamente.");

          await db.Usuario.update({
            where: { idUsuario: usuario.idUsuario },
            data: { Bloqueado: false, intentos_fallidos: 0 },
          });

          await logsDb.logs_Sistema.create({
            data: {
              idUsuario: usuario.Nombre_usuario,
              Tipo_evento: "DESBLOQUEO_AUTOMATICO",
              Descripcion: `Usuario ${usuario.Nombre_usuario} ha sido desbloqueado automáticamente tras 20 segundos.`,
              ipUsuario: "0.0.0.0",
              Nivel: "INFO",
              Fecha: obtenerFechaBolivia(), // 📌 Fecha corregida a Bolivia UTC-4
            },
          });

          await registrarIntentoLogin(usuario.Nombre_usuario, ipUsuario, true, "Reinicio de intentos tras desbloqueo automático", 0);

          usuario.Bloqueado = false;
          usuario.intentos_fallidos = 0;
        } else {
          const segundosRestantes = Math.ceil((tiempoBloqueo - new Date()) / 1000);
          throw new Error(`Usuario bloqueado. Espere ${segundosRestantes} segundos o contacte al administrador.`);
        }
      }
    }

    const esValida = await bcrypt.compare(Contrasenia, usuario.Contrasenia);
    if (!esValida) {
      const nuevoIntento = usuario.intentos_fallidos + 1;

      await registrarIntentoLogin(usuario.Nombre_usuario, ipUsuario, false, "Contraseña incorrecta", nuevoIntento);

      await logsDb.logs_Sistema.create({
        data: {
          idUsuario: usuario.Nombre_usuario,
          Tipo_evento: "LOGIN_FALLIDO",
          Descripcion: `Contraseña incorrecta en intento de inicio de sesión: Intento ${nuevoIntento}`,
          ipUsuario: ipUsuario || "0.0.0.0",
          Nivel: "ADVERTENCIA",
          Fecha: fechaBolivia, // 📌 Fecha corregida a Bolivia UTC-4
        },
      });

      if (nuevoIntento >= 5) {
        await db.Usuario.update({
          where: { idUsuario: usuario.idUsuario },
          data: { Bloqueado: true, intentos_fallidos: nuevoIntento },
        });

        await logsDb.logs_Sistema.create({
          data: {
            idUsuario: usuario.Nombre_usuario,
            Tipo_evento: "USUARIO_BLOQUEADO",
            Descripcion: `Usuario ${Nombre_usuario} ha sido bloqueado tras 5 intentos fallidos.`,
            ipUsuario: ipUsuario || "0.0.0.0",
            Nivel: "CRÍTICO",
            Fecha: fechaBolivia, // 📌 Fecha corregida a Bolivia UTC-4
          },
        });

        throw new Error("Usuario bloqueado tras 5 intentos fallidos.");
      }

      await db.Usuario.update({
        where: { idUsuario: usuario.idUsuario },
        data: { intentos_fallidos: nuevoIntento },
      });

      throw new Error("Credenciales incorrectas.");
    }

    await db.Usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: { intentos_fallidos: 0 },
    });

    await registrarIntentoLogin(usuario.Nombre_usuario, ipUsuario, true, "Reinicio de intentos tras inicio de sesión", 0);

    const usuarioRol = usuario.UsuarioRol.length > 0 ? usuario.UsuarioRol[0] : null;
    const rolNombre = usuarioRol ? usuarioRol.Rol.Nombre : "Sin rol";
    const permisos = usuarioRol
      ? usuarioRol.Permisos.map((permiso) => ({
          modulo: permiso.Modulo.Nombre,
          permisos: {
            crear: permiso.Crear,
            actualizar: permiso.Actualizar,
            eliminar: permiso.Eliminar,
            leer: permiso.Leer,
            reportes: permiso.Reportes,
          },
        }))
      : [];

    const token = jwt.sign(
      { userId: usuario.idUsuario, rol: rolNombre, permisos },
      process.env.JWT_SECRET,
      { expiresIn: "30m", algorithm: "HS256" }
    );

    await logsDb.logs_Sistema.create({
      data: {
          idUsuario: usuario.Nombre_usuario,
          Tipo_evento: "LOGIN_EXITOSO",
          Descripcion: "Inicio de sesión exitoso",
          ipUsuario: ipUsuario || "0.0.0.0",
          Nivel: "INFO",
          Fecha: fechaBolivia, // 📌 Se usa la función corregida
      },
  });
  

    return { token, rol: rolNombre, permisos };
  } catch (error) {
    console.error("❌ Error en loginUsuario:", error.message);
    throw error;
  }
};






/**
 * Inicia sesión de administrador verificando el rol correctamente.
 */
export const loginAdmin = async (Nombre_usuario, Contrasenia, res) => {
  const usuario = await verificarCredenciales(Nombre_usuario, Contrasenia);
  const usuarioRol = await prisma.usuarioRol.findFirst({
    where: { idUsuario: usuario.idUsuario },
    include: { Rol: true },
  });

  if (!usuarioRol || usuarioRol.Rol.Nombre !== "Admin") {
    throw new Error("Esta cuenta no es de administrador");
  }

  const { permisos } = await obtenerPermisosUsuario(usuario.idUsuario);
  const token = generarToken(usuario.idUsuario, usuarioRol.Rol.Nombre);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 2 * 60 * 60 * 1000,
  });

  return { permisos };
};

/**
 * Cierra sesión eliminando la cookie del cliente.
 */
export const logoutUsuario = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return { message: "Sesión cerrada correctamente" };
};

/**
 * Obtiene la información del administrador autenticado.
 */
export const obtenerInfoAdmin = async (adminId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { idUsuario: adminId },
    include: { Persona: true },
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  const usuarioRol = await prisma.usuarioRol.findFirst({
    where: { idUsuario: adminId },
    include: { Rol: true },
  });

  if (!usuarioRol || usuarioRol.Rol.Nombre !== "Admin") {
    throw new Error("No tienes permiso para acceder a esta información.");
  }

  return {
    usuario: {
      Nombre_usuario: usuario.Nombre_usuario,
      Rol: usuarioRol.Rol.Nombre,
    },
    persona: usuario.Persona,
  };
};

/**
 * Actualiza la información del administrador autenticado.
 */
export const actualizarInfoAdmin = async (adminId, data) => {
  const usuario = await prisma.usuario.findUnique({
    where: { idUsuario: adminId },
    include: { Persona: true },
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  const usuarioRol = await prisma.usuarioRol.findFirst({
    where: { idUsuario: adminId },
    include: { Rol: true },
  });

  if (!usuarioRol || usuarioRol.Rol.Nombre !== "Admin") {
    throw new Error("No tienes permiso para acceder a esta información.");
  }

  const updatedPersona = await prisma.persona.update({
    where: { idPersona: usuario.idPersona },
    data,
  });

  return updatedPersona;
};
