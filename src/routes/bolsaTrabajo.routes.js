import express from "express";
import {
  getBolsaTrabajo,
  getBolsaTrabajoById,
  createBolsaTrabajo,
  updateBolsaTrabajo,
  deleteBolsaTrabajo
} from "../controllers/bolsaTrabajo.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, authorize("BolsaTrabajo", "Crear"), createBolsaTrabajo);
router.get("/all", authenticateUser, getBolsaTrabajo);
router.get("/:id", authenticateUser, getBolsaTrabajoById);
router.put("/:id", authenticateUser, authorize("BolsaTrabajo", "Actualizar"), updateBolsaTrabajo);
router.delete("/:id", authenticateUser, authorize("BolsaTrabajo", "Eliminar"), deleteBolsaTrabajo);

export default router;
