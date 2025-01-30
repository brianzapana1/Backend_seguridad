import express from "express";
import {
  getActividades,
  getActividadById,
  createActividad,
  updateActividad,
  deleteActividad
} from "../controllers/actividades.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, authorize("Actividades", "Crear"), createActividad);
router.get("/all", authenticateUser, getActividades);
router.get("/:id", authenticateUser, getActividadById);
router.put("/:id", authenticateUser, authorize("Actividades", "Actualizar"), updateActividad);
router.delete("/:id", authenticateUser, authorize("Actividades", "Eliminar"), deleteActividad);

export default router;
