import { Router } from "express";

const router = Router();

import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  loginController,
  updateUserController,
} from "../controllers/user.controller";
import jwtKeyVerifier from "../middlewares/jwt-key-verifier.middleware";
import authorizeSelf from "../middlewares/authorize-self.middleware";

// User routes
router.post("/login", loginController);
router.post("/", createUserController);

router.get("/", jwtKeyVerifier, getAllUsersController);
router.get("/:id", jwtKeyVerifier, authorizeSelf, getUserByIdController);

router.put("/:id", jwtKeyVerifier, authorizeSelf, updateUserController);
router.delete("/:id", jwtKeyVerifier, authorizeSelf, deleteUserController);

export default router;
