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
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

// Document routes
router.get(
  "/admin",
  protect,
  requireAdmin,
  limiter("fetchDocuments"),
  getAllDocumentsController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("getDocumentsByUserPaginated"),
  getDocumentsByUserPaginatedController,
);

router.get(
  "/:id",
  protect,
  limiter("fetchSingleDocument"),
  getDocumentByIdController,
);

router.post(
  "/",
  protect,
  limiter("uploadDocument"),
  upload.single("file"),
  createDocumentController,
);

router.post(
  "/reprocess",
  protect,
  limiter("reprocessDocument"),
  upload.single("file"),
  createDocumentController,
);

router.put(
  "/:id",
  protect,
  limiter("updateDocument"),
  updateDocumentController,
);

router.delete(
  "/:id",
  protect,
  limiter("deleteDocument"),
  deleteDocumentByIdController,
);

export default router;
