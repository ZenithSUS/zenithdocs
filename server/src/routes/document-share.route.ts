import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  createDocumentShareController,
  deleteDocumentShareController,
  getDocumentShareByIdController,
  getDocumentShareByTokenController,
  getDocumentSharesByUserIdPaginatedController,
  updateDocumentShareController,
} from "../controllers/document-share.controller.js";
import limiter from "../middlewares/limiter.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";

const router = Router();

router.post(
  "/",
  protect,
  limiter("createDocumentShare"),
  createDocumentShareController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("getDocumentSharesByUserIdPaginated"),
  getDocumentSharesByUserIdPaginatedController,
);
router.get(
  "/:id",
  protect,
  limiter("getDocumentShareById"),
  getDocumentShareByIdController,
);
router.get(
  "/token/:token",
  limiter("getDocumentShareByToken"),
  getDocumentShareByTokenController,
);

router.put(
  "/:id",
  protect,
  limiter("updateDocumentShare"),
  updateDocumentShareController,
);

router.delete(
  "/:id",
  protect,
  limiter("deleteDocumentShare"),
  deleteDocumentShareController,
);

export default router;
