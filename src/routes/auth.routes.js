import express from "express";
import {
  login,
  loginAdminController,
  getUserInfo,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/login-admin", loginAdminController);
router.get("/user-info", getUserInfo);  
router.post("/logout", logout);  

export default router;
