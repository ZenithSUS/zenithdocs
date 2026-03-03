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
import upload from "../middlewares/upload.middleware.js";
import rateLimit from "../middlewares/ratelimit.middleware.js";

const router = Router();

// Document routes
router.get(
  "/admin",
  protect,
  requireAdmin,
  rateLimit("fetchDocuments"),
  getAllDocumentsController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("getDocumentsByUserPaginated"),
  getDocumentsByUserPaginatedController,
);

router.get(
  "/:id",
  protect,
  rateLimit("fetchSingleDocument"),
  getDocumentByIdController,
);

router.post(
  "/",
  protect,
  rateLimit("uploadDocument"),
  upload.single("file"),
  createDocumentController,
);

router.put(
  "/:id",
  protect,
  rateLimit("updateDocument"),
  updateDocumentController,
);

router.delete(
  "/:id",
  protect,
  rateLimit("deleteDocument"),
  deleteDocumentByIdController,
);

export default router;
