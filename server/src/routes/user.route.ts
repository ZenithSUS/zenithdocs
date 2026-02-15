import { Router } from "express";

const router = Router();

import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from "../controllers/user.controller";
import jwtKeyVerifier from "../middlewares/jwt-key-verifier.middleware";
import authorizeSelf from "../middlewares/authorize-self.middleware";

// User routes
router.get("/", jwtKeyVerifier, getAllUsersController);
router.get("/:id", jwtKeyVerifier, authorizeSelf, getUserByIdController);

router.put("/:id", jwtKeyVerifier, authorizeSelf, updateUserController);
router.delete("/:id", jwtKeyVerifier, authorizeSelf, deleteUserController);

export default router;
