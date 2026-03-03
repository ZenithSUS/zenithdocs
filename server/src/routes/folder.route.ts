import { Router } from "express";
import {
  createFolderController,
  getFoldersByUserController,
  getFolderByIdController,
  getAllFoldersAdminController,
  getFolderByUserPaginatedController,
  updateFolderController,
  deleteFolderController,
} from "../controllers/folder.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import requireAdmin from "../middlewares/require-admin.middleware.js";
import rateLimit from "../middlewares/ratelimit.middleware.js";

const router = Router();

// Folder routes
router.get(
  "/admin",
  protect,
  requireAdmin,
  rateLimit("fetchFoldersAdmin"),
  getAllFoldersAdminController,
);

router.get(
  "/user/:id/paginated",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("getFoldersByUserPaginated"),
  getFolderByUserPaginatedController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  rateLimit("getFoldersByUser"),
  getFoldersByUserController,
);

router.post("/", protect, rateLimit("createFolder"), createFolderController);

router.get("/:id", protect, rateLimit("fetchFolder"), getFolderByIdController);

router.put("/:id", protect, rateLimit("updateFolder"), updateFolderController);

router.delete(
  "/:id",
  protect,
  rateLimit("deleteFolder"),
  deleteFolderController,
);

export default router;
