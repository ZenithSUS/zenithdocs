import { Router } from "express";
import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  searchUsersByEmailController,
  updateUserController,
} from "../controllers/user.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

// User routes
router.get(
  "/",
  protect,
  requireAdmin,
  limiter("fetchUsersAdmin"),
  getAllUsersController,
);

router.get(
  "/search",
  protect,
  limiter("searchUsersByEmail"),
  searchUsersByEmailController,
);

router.get(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("fetchUser"),
  getUserByIdController,
);

router.put(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("updateUser"),
  updateUserController,
);

router.delete(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("deleteUser"),
  deleteUserController,
);

export default router;
