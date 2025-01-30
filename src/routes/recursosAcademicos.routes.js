import express from "express";
import {
  getRecursosAcademicos,
  getRecursoById,
  createRecursoAcademico,
  updateRecursoAcademico,
  deleteRecursoAcademico
} from "../controllers/recursosAcademicos.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();
const ID_MODULO_GESTION_USUARIOS = 3; 


// router.post("/register", createUsuario);


router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/recursosAc - Usuario ${req.userId}`);
  getRecursosAcademicos(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/recursosAc/${req.params.id} - Usuario ${req.userId}`);
  getRecursoById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/recursosAc/register - Usuario ${req.userId}`);
  createRecursoAcademico(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/recursosAc/${req.params.id} - Usuario ${req.userId}`);
  updateRecursoAcademico(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/recursosAc/${req.params.id} - Usuario ${req.userId}`);
  deleteRecursoAcademico(req, res, next);
});


export default router;
