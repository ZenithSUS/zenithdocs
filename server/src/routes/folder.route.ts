import { Router } from "express";
import {
  createFolderController,
  getFoldersByUserController,
  getFolderByIdController,
  getAllFoldersAdminController,
  getFoldersWithDocumentsByUserPaginatedController,
  updateFolderController,
  deleteFolderController,
} from "../controllers/folder.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

// Folder routes
router.get(
  "/admin",
  protect,
  requireAdmin,
  limiter("fetchFoldersAdmin"),
  getAllFoldersAdminController,
);

router.get(
  "/user/:id/paginated",
  protect,
  authorizeSelfOrAdmin,
  limiter("getFoldersByUserPaginated"),
  getFoldersWithDocumentsByUserPaginatedController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("getFoldersByUser"),
  getFoldersByUserController,
);

router.post("/", protect, limiter("createFolder"), createFolderController);

router.get("/:id", protect, limiter("fetchFolder"), getFolderByIdController);

router.put("/:id", protect, limiter("updateFolder"), updateFolderController);

router.delete("/:id", protect, limiter("deleteFolder"), deleteFolderController);

export default router;
