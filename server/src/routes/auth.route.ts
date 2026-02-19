import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  loginController,
  registerUserController,
  getMeController,
  refreshAccessTokenController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerUserController);
router.post("/refresh", refreshAccessTokenController);

router.get("/me", protect, getMeController);

export default router;
