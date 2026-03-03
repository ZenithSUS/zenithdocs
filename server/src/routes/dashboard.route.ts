import { Router } from "express";
import { getDashboardOverviewController } from "../controllers/dashboard.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import rateLimit from "../middlewares/ratelimit.middleware.js";

const router = Router();

router.get(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("fetchDashboardOverview"),
  getDashboardOverviewController,
);

export default router;
