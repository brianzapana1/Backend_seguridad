import express from "express";
import {
  getHistorialesAcademicos,
  getHistorialAcademicoById,
  createHistorialAcademico,
  updateHistorialAcademico,
  deleteHistorialAcademico
} from "../controllers/historialAcademico.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, authorize("HistorialAcademico", "Crear"), createHistorialAcademico);
router.get("/all", authenticateUser, getHistorialesAcademicos);
router.get("/:id", authenticateUser, getHistorialAcademicoById);
router.put("/:id", authenticateUser, authorize("HistorialAcademico", "Actualizar"), updateHistorialAcademico);
router.delete("/:id", authenticateUser, authorize("HistorialAcademico", "Eliminar"), deleteHistorialAcademico);

export default router;
