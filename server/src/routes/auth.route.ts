import { Router } from "express";

const router = Router();

import {
  loginController,
  createUserController,
  getMeController,
} from "../controllers/user.controller.js";
import jwtKeyVerifier from "../middlewares/jwt-key-verifier.middleware.js";

router.post("/login", loginController);
router.post("/register", createUserController);

router.get("/me", jwtKeyVerifier, getMeController);

export default router;
