import express from "express";
import {
  getBecas,
  getBecaById,
  createBeca,
  updateBeca,
  deleteBeca
} from "../controllers/admiBeca.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, authorize("AdmiBeca", "Crear"), createBeca);
router.get("/all", authenticateUser, getBecas);
router.get("/:id", authenticateUser, getBecaById);
router.put("/:id", authenticateUser, authorize("AdmiBeca", "Actualizar"), updateBeca);
router.delete("/:id", authenticateUser, authorize("AdmiBeca", "Eliminar"), deleteBeca);

export default router;
