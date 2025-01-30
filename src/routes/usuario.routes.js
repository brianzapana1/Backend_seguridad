import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  cambiarContrasenia, // 🆕 Nueva función agregada
} from "../controllers/usuario.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();
const ID_MODULO_GESTION_USUARIOS = 1;

// ✅ Ruta para actualizar la contraseña de un usuario (solo autenticación, sin permisos adicionales)
router.put("/:id/password", authenticateUser, (req, res, next) => {
  console.log(`📥 [PUT] /api/usuarios/${req.params.id}/password - Usuario ${req.userId}`);
  cambiarContrasenia(req, res, next);
});

router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/usuarios - Usuario ${req.userId}`);
  getUsuarios(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/usuarios/${req.params.id} - Usuario ${req.userId}`);
  getUsuarioById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/usuarios/register - Usuario ${req.userId}`);
  createUsuario(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/usuarios/${req.params.id} - Usuario ${req.userId}`);
  updateUsuario(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/usuarios/${req.params.id} - Usuario ${req.userId}`);
  deleteUsuario(req, res, next);
});

export default router;
