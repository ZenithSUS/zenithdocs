import { Router } from "express";
import { getDashboardOverviewController } from "../controllers/dashboard.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

router.get(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("fetchDashboardOverview"),
  getDashboardOverviewController,
);

export default router;
