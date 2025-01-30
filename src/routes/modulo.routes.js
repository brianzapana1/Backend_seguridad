import express from "express";
import {
  getModulos,
  getModuloById,
  createModulo,
  updateModulo,
  deleteModulo,
} from "../controllers/modulo.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

const ID_MODULO_GESTION_USUARIOS = 6; 


// router.post("/register", createUsuario);


router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/modulos - Usuario ${req.userId}`);
  getModulos(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/modulos/${req.params.id} - Usuario ${req.userId}`);
  getModuloById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/modulos/register - Usuario ${req.userId}`);
  createModulo(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/modulos/${req.params.id} - Usuario ${req.userId}`);
  updateModulo(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/modulos/${req.params.id} - Usuario ${req.userId}`);
  deleteModulo(req, res, next);
});


export default router;
