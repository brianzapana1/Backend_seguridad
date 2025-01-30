import express from "express";
import {
  getEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento
} from "../controllers/eventos.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, authorize("Eventos", "Crear"), createEvento);
router.get("/all", authenticateUser, getEventos);
router.get("/:id", authenticateUser, getEventoById);
router.put("/:id", authenticateUser, authorize("Eventos", "Actualizar"), updateEvento);
router.delete("/:id", authenticateUser, authorize("Eventos", "Eliminar"), deleteEvento);

export default router;
