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
} from "../controllers/summary.controller.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";

const router = Router();

// Summary routes
router.get("/", protect, requireAdmin, getAllSummaryController);

router.get(
  "/document/:id",
  protect,
  authorizeSelfOrAdmin,
  getSummaryByDocumentPaginatedController,
);

router.get("/:id", protect, authorizeSelfOrAdmin, getSummaryByIdController);

router.post("/", protect, createSummaryController);
router.put("/:id", protect, authorizeSelfOrAdmin, updateSummaryController);
router.delete("/:id", protect, authorizeSelfOrAdmin, deleteSummaryController);

export default router;
