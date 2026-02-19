import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import isAdmin from "../middlewares/is-admin.middleware.js";
import {
  getAllSummaryController,
  getSummaryByIdController,
} from "../controllers/summary.controller.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";

const router = Router();

router.get("/", protect, isAdmin, getAllSummaryController);
router.get("/:id", protect, authorizeSelfOrAdmin, getSummaryByIdController);
