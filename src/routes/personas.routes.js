import express from "express";
import { registerPersona, getPersonas, updatePersona, deletePersona, getPersonaById } from "../controllers/personas.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Rutas protegidas con autenticación y control de permisos
// router.post("/register", registerPersona);
const ID_MODULO_GESTION_USUARIOS = 5; 


router.get("/all", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
    console.log(`📥 [GET] /api/personas - Usuario ${req.userId}`);
    getPersonas(req, res, next);
  });

  router.get("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Leer"), (req, res, next) => {
    console.log(`📥 [GET] /api/personas/${req.params.id} - Usuario ${req.userId}`);
    getPersonaById(req, res, next);
  });
  
  router.post("/register", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Crear"), (req, res, next) => {
    console.log(`📥 [POST] /api/personas/register - Usuario ${req.userId}`);
    registerPersona(req, res, next);
  });
  
  router.put("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Actualizar"), (req, res, next) => {
    console.log(`📥 [PUT] /api/personas/${req.params.id} - Usuario ${req.userId}`);
    updatePersona(req, res, next);
  });
  
  router.delete("/:id", authenticateUser, authorize(ID_MODULO_GESTION_USUARIOS, "Eliminar"), (req, res, next) => {
    console.log(`📥 [DELETE] /api/personas/${req.params.id} - Usuario ${req.userId}`);
    deletePersona(req, res, next);
  });

export default router;
