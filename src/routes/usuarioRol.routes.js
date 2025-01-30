import express from "express";
import {
  getUsuarioRoles,
  getUsuarioRolById,
  createUsuarioRol,
  updateUsuarioRol,
  deleteUsuarioRol,
} from "../controllers/usuarioRol.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
const router = express.Router();

const ID_MODULO_GESTION_USUARIOS = 9; 


// router.post("/register", createUsuario);


router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/usuarioRol - Usuario ${req.userId}`);
  getUsuarioRoles(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/usuarioRol/${req.params.id} - Usuario ${req.userId}`);
  getUsuarioRolById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/usuarioRol/register - Usuario ${req.userId}`);
  createUsuarioRol(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/usuarioRol/${req.params.id} - Usuario ${req.userId}`);
  updateUsuarioRol(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/usuarioRol/${req.params.id} - Usuario ${req.userId}`);
  deleteUsuarioRol(req, res, next);
});


export default router;
