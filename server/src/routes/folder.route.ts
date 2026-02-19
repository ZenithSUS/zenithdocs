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

const router = Router();

// Folder routes
router.post("/", protect, createFolderController);
router.get("/admin", protect, requireAdmin, getAllFoldersAdminController);
router.get(
  "/user/:id/paginated",
  protect,
  authorizeSelfOrAdmin,
  getFolderByUserPaginatedController,
);
router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  getFoldersByUserController,
);
router.get("/:id", protect, getFolderByIdController);
router.put("/:id", protect, updateFolderController);
router.delete("/:id", protect, deleteFolderController);

export default router;
