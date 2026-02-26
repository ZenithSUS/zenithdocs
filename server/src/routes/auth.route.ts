import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  loginController,
  registerUserController,
  getMeController,
  refreshAccessTokenController,
  logoutController,
} from "../controllers/auth.controller.js";
import refreshProctect from "../middlewares/refresh-protect.js";

const router = Router();

// Authentication routes
router.post("/login", loginController);
router.post("/register", registerUserController);
router.post("/logout", logoutController);
router.post("/refresh", refreshProctect, refreshAccessTokenController);

// Get current user
router.get("/me", protect, getMeController);

export default router;
