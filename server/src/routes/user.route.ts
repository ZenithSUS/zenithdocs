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
import rateLimit from "../middlewares/ratelimit.middleware.js";

const router = Router();

// User routes
router.get(
  "/",
  protect,
  requireAdmin,
  rateLimit("fetchUsersAdmin"),
  getAllUsersController,
);

router.get(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("fetchUser"),
  getUserByIdController,
);

router.put(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("updateUser"),
  updateUserController,
);

router.delete(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("deleteUser"),
  deleteUserController,
);
export default router;
