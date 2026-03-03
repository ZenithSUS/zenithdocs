import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";
import {
  createSummaryController,
  deleteSummaryController,
  getAllSummaryController,
  getSummaryByIdController,
  getSummaryByDocumentPaginatedController,
  updateSummaryController,
  getSummaryByUserPaginatedController,
} from "../controllers/summary.controller.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

// Summary routes
router.get(
  "/",
  protect,
  requireAdmin,
  limiter("fetchSummary"),
  getAllSummaryController,
);

router.get(
  "/document/:id",
  protect,
  limiter("getSummaryByDocumentPaginated"),
  getSummaryByDocumentPaginatedController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("getSummaryByUserPaginated"),
  getSummaryByUserPaginatedController,
);

router.get("/:id", protect, limiter("fetchSummary"), getSummaryByIdController);

router.post("/", protect, limiter("createSummary"), createSummaryController);

router.put("/:id", protect, limiter("updateSummary"), updateSummaryController);

router.delete(
  "/:id",
  protect,
  limiter("deleteSummary"),
  deleteSummaryController,
);

export default router;
