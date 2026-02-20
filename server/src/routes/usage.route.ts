import { Router } from "express";
import {
  createUsageController,
  getAllUsageAdminController,
  getUsageByUserAndMonthController,
  getUsageByUserController,
  updateUsageController,
  deleteUsageController,
  deleteUsageByUserController,
} from "../controllers/usage.controller.js";
import protect from "../middlewares/protect.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";

const router = Router();

// Usage routes
router.get("/", protect, requireAdmin, getAllUsageAdminController);
router.get(
  "/user/:id/:month",
  protect,
  authorizeSelfOrAdmin,
  getUsageByUserAndMonthController,
);
router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  getUsageByUserController,
);
router.post("/", protect, createUsageController);
router.put("/:id", protect, updateUsageController);
router.delete(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  deleteUsageByUserController,
);
router.delete("/:id", protect, deleteUsageController);

export default router;
