import express from "express";
import {
  getPermisos,
  getPermisoById,
  createPermiso,
  updatePermiso,
  deletePermiso,
} from "../controllers/permiso.controller.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();
const ID_MODULO_GESTION_USUARIOS = 4; 


// Rutas CRUD de Permisos
router.get("/all",authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req,res,next) =>{
  console.log(`📥 [GET] /api/permisos - Usuario ${req.userId}`);
  getPermisos(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/permisos/${req.params.id} - Usuario ${req.userId}`);
  getPermisoById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/permisos/register - Usuario ${req.userId}`);
  createPermiso(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/permisos/${req.params.id} - Usuario ${req.userId}`);
  updatePermiso(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/usuarios/${req.params.id} - Usuario ${req.userId}`);
  deletePermiso(req, res, next);
});

export default router;
