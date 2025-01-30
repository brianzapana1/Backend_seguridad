import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🔐 Genera un Access Token con tiempo de expiración corto (15 min)
 * @param {number} userId - ID del usuario
 * @param {string} rol - Rol del usuario
 * @returns {string} Token JWT
 */
export const generarToken = (userId, rol) => {
  return jwt.sign(
    { userId, rol }, 
    process.env.JWT_SECRET,  
    { expiresIn: "15m", algorithm: "HS256" }  
  );
};

/**
 * 🔄 Genera un Refresh Token con duración más larga (7 días)
 * @param {number} userId - ID del usuario
 * @returns {string} Refresh Token JWT
 */
export const generarRefreshToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.REFRESH_SECRET,  
    { expiresIn: "7d", algorithm: "HS256" }  
  );
};

/**
 * 🔍 Verifica y decodifica un Access Token
 * @param {string} token - Token JWT recibido
 * @returns {object|null} Decodificación del token o null si es inválido
 */
export const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * 🔍 Verifica y decodifica un Refresh Token
 * @param {string} token - Refresh Token JWT recibido
 * @returns {object|null} Decodificación del token o null si es inválido
 */
export const verificarRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
