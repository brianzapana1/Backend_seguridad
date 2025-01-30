import express from "express";
import {
  getCarreras,
  getCarreraById,
  createCarrera,
  updateCarrera,
  deleteCarrera,
} from "../controllers/carrera.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";


const router = express.Router();

const ID_MODULO_GESTION_USUARIOS = 10; 




router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/carreras - Usuario ${req.userId}`);
  getCarreras(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/carreras/${req.params.id} - Usuario ${req.userId}`);
  getCarreraById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/carreras/register - Usuario ${req.userId}`);
  createCarrera(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/carreras/${req.params.id} - Usuario ${req.userId}`);
  updateCarrera(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/carreras/${req.params.id} - Usuario ${req.userId}`);
  deleteCarrera(req, res, next);
});

export default router;
