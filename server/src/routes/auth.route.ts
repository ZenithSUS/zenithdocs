import { Router } from "express";

const router = Router();

import {
  loginController,
  createUserController,
} from "../controllers/user.controller";

router.post("/login", loginController);
router.post("/register", createUserController);

export default router;
