import { registrarLogSistema } from "../services/logsSistema.service.js";

export const errorHandler = async (err, req, res, next) => {
  console.error("❌ Error detectado:", err.message);

  await registrarLogSistema({
    idUsuario: req.user?.userId || null,
    Tipo_evento: "ERROR_APP",
    Descripcion: err.message,
    ipUsuario: req.ip,
    Nivel: "ERROR",
  });

  res.status(500).json({ message: "Error interno del servidor." });
};
