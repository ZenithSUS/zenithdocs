import { Router } from "express";
import { getDashboardOverviewController } from "../controllers/dashboard.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";

const router = Router();

router.get(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  getDashboardOverviewController,
);

export default router;
