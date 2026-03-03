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
import rateLimit from "../middlewares/ratelimit.middleware.js";

const router = Router();

// Summary routes
router.get(
  "/",
  protect,
  requireAdmin,
  rateLimit("fetchSummary"),
  getAllSummaryController,
);

router.get(
  "/document/:id",
  protect,
  rateLimit("getSummaryByDocumentPaginated"),
  getSummaryByDocumentPaginatedController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("getSummaryByUserPaginated"),
  getSummaryByUserPaginatedController,
);

router.get(
  "/:id",
  protect,
  rateLimit("fetchSummary"),
  getSummaryByIdController,
);

router.post("/", protect, rateLimit("createSummary"), createSummaryController);

router.put(
  "/:id",
  protect,
  rateLimit("updateSummary"),
  updateSummaryController,
);

router.delete(
  "/:id",
  protect,
  rateLimit("deleteSummary"),
  deleteSummaryController,
);

export default router;
