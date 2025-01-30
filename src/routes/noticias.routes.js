import express from "express";
import {
  getNoticias,
  getNoticiaById,
  createNoticia,
  updateNoticia,
  deleteNoticia
} from "../controllers/noticias.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

const ID_MODULO_GESTION_USUARIOS = 2; 

// router.post("/register", createUsuario);


router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/noticias - Usuario ${req.userId}`);
  getNoticias(req, res, next);
});

router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
  console.log(`📥 [GET] /api/noticias/${req.params.id} - Usuario ${req.userId}`);
  getNoticiaById(req, res, next);
});

router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
  console.log(`📥 [POST] /api/noticias/register - Usuario ${req.userId}`);
  createNoticia(req, res, next);
});

router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
  console.log(`📥 [PUT] /api/noticias/${req.params.id} - Usuario ${req.userId}`);
  updateNoticia(req, res, next);
});

router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
  console.log(`📥 [DELETE] /api/noticias/${req.params.id} - Usuario ${req.userId}`);
  deleteNoticia(req, res, next);
});


export default router;
