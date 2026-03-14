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
import limiter from "../middlewares/express-limiter.middleware.js";

const router = Router();

// Usage routes
router.get(
  "/user/:id/last-six-months",
  protect,
  authorizeSelfOrAdmin,
  limiter("getLastSixMonthsUsage"),
  getLastSixMonthsUsageByUserController,
);

router.get(
  "/user/:id/:month",
  protect,
  authorizeSelfOrAdmin,
  limiter("getUsageByUserAndMonth"),
  getUsageByUserAndMonthController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("fetchUsage"),
  getUsageByUserController,
);

router.get(
  "/",
  protect,
  requireAdmin,
  limiter("fetchUsageAdmin"),
  getAllUsageAdminController,
);

router.post("/", protect, limiter("createUsage"), createUsageController);

router.put("/:id", protect, limiter("updateUsage"), updateUsageController);

router.delete(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("deleteUsageByUser"),
  deleteUsageByUserController,
);

router.delete("/:id", protect, limiter("deleteUsage"), deleteUsageController);

export default router;
