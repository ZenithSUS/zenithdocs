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
import isAdmin from "../middlewares/is-admin.middleware.js";

const router = Router();

router.get("/:id", protect, getDocumentByIdController);
router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  getDocumentsByUserPaginatedController,
);
router.get("/admin", protect, isAdmin, getAllDocumentsController);

router.post("/", protect, createDocumentController);
router.put("/:id", protect, authorizeSelfOrAdmin, updateDocumentController);

router.delete(
  "/:id",
  protect,
  authorizeSelfOrAdmin,
  deleteDocumentByIdController,
);

export default router;
