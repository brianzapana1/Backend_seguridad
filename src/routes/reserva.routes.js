import express from "express";
import {
  getReservas,
  getReservaById,
  createReserva,
  updateReserva,
  deleteReserva
} from "../controllers/reserva.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

const ID_MODULO_GESTION_USUARIOS = 7; 


// router.post("/register", createUsuario);

router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/reservas - Usuario ${req.userId}`);
  getReservas(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/reservas/${req.params.id} - Usuario ${req.userId}`);
  getReservaById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/reservas/register - Usuario ${req.userId}`);
  createReserva(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/reservas/${req.params.id} - Usuario ${req.userId}`);
  updateReserva(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/reservas/${req.params.id} - Usuario ${req.userId}`);
  deleteReserva(req, res, next);
});


export default router;
