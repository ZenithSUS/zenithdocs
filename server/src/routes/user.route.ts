import { Router } from "express";
import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from "../controllers/user.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = Router();

// User routes
router.get("/", protect, requireAdmin, getAllUsersController);
router.get("/:id", protect, authorizeSelfOrAdmin, getUserByIdController);

router.put("/:id", protect, authorizeSelfOrAdmin, updateUserController);
router.delete("/:id", protect, authorizeSelfOrAdmin, deleteUserController);

export default router;
