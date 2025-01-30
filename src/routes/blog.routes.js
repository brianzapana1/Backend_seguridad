import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blog.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, authorize("Blog", "Crear"), createBlog);
router.get("/all", authenticateUser, getBlogs);
router.get("/:id", authenticateUser, getBlogById);
router.put("/:id", authenticateUser, authorize("Blog", "Actualizar"), updateBlog);
router.delete("/:id", authenticateUser, authorize("Blog", "Eliminar"), deleteBlog);

export default router;
