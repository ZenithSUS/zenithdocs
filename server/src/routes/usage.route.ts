import { Router } from "express";
import {
  createUsageController,
  getAllUsageAdminController,
  getUsageByUserAndMonthController,
  getUsageByUserController,
  getLastSixMonthsUsageByUserController,
  updateUsageController,
  deleteUsageController,
  deleteUsageByUserController,
} from "../controllers/usage.controller.js";
import protect from "../middlewares/protect.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import rateLimit from "../middlewares/ratelimit.middleware.js";

const router = Router();

// Usage routes
router.get(
  "/user/:id/last-six-months",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("getLastSixMonthsUsage"),
  getLastSixMonthsUsageByUserController,
);

router.get(
  "/user/:id/:month",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("getUsageByUserAndMonth"),
  getUsageByUserAndMonthController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("fetchUsage"),
  getUsageByUserController,
);

router.get(
  "/",
  protect,
  requireAdmin,
  rateLimit("fetchUsageAdmin"),
  getAllUsageAdminController,
);

router.post("/", protect, rateLimit("createUsage"), createUsageController);

router.put("/:id", protect, rateLimit("updateUsage"), updateUsageController);

router.delete(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("deleteUsageByUser"),
  deleteUsageByUserController,
);

router.delete("/:id", protect, rateLimit("deleteUsage"), deleteUsageController);

export default router;
