import { verificarToken } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  try {
    if (!req.cookies) {
      console.warn("⚠️ No hay cookies en la solicitud.");
      return res.status(400).json({ message: "Error: No se encontraron cookies en la solicitud." });
    }

    const token = req.cookies.access_token; // Obtener token desde la cookie

    console.log(`🔐 Intento de autenticación - Token recibido: ${token ? "✅ Sí" : "❌ No"}`);

    if (!token) {
      console.warn("❌ Acceso denegado: No se encontró token en la cookie.");
      return res.status(401).json({ message: "Acceso denegado. No se encontró token." });
    }

    const decoded = verificarToken(token);

    if (!decoded) {
      console.warn("🚫 Token inválido o expirado.");
      return res.status(403).json({ message: "Token inválido o expirado." });
    }

    console.log(`✅ Usuario autenticado - ID: ${decoded.userId}, Rol: ${decoded.rol}`);

    req.userId = decoded.userId;
    req.rol = decoded.rol;
    next();
  } catch (error) {
    console.error("❌ Error en autenticación:", error.message);
    res.status(500).json({ message: "Error en autenticación." });
  }
};
