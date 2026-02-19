import { Router } from "express";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import {
  createDocumentController,
  deleteDocumentByIdController,
  getAllDocumentsController,
  getDocumentByIdController,
  getDocumentsByUserPaginatedController,
  updateDocumentController,
} from "../controllers/document.controller.js";
import protect from "../middlewares/protect.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";

const router = Router();

router.get("/admin", protect, requireAdmin, getAllDocumentsController);
router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  getDocumentsByUserPaginatedController,
);

router.get("/:id", protect, getDocumentByIdController);

router.post("/", protect, createDocumentController);
router.put("/:id", protect, updateDocumentController);
router.delete("/:id", protect, deleteDocumentByIdController);

export default router;
