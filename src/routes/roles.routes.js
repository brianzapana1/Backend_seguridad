import express from "express";
import {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
} from "../controllers/roles.controller.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

const ID_MODULO_GESTION_USUARIOS = 8; 




router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/roles - Usuario ${req.userId}`);
  getRoles(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/roles/${req.params.id} - Usuario ${req.userId}`);
  getRolById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/roles/register - Usuario ${req.userId}`);
  createRol(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/roles/${req.params.id} - Usuario ${req.userId}`);
  updateRol(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/roles/${req.params.id} - Usuario ${req.userId}`);
  deleteRol(req, res, next);
});


export default router;
