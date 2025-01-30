import express from "express";
import {
  getBeneficiarios,
  getBeneficiarioById,
  createBeneficiario,
  updateBeneficiario,
  deleteBeneficiario
} from "../controllers/beneficiariosBeca.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, authorize("BeneficiariosBeca", "Crear"), createBeneficiario);
router.get("/all", authenticateUser, getBeneficiarios);
router.get("/:id", authenticateUser, getBeneficiarioById);
router.put("/:id", authenticateUser, authorize("BeneficiariosBeca", "Actualizar"), updateBeneficiario);
router.delete("/:id", authenticateUser, authorize("BeneficiariosBeca", "Eliminar"), deleteBeneficiario);

export default router;
