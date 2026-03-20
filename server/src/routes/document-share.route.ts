import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  createDocumentShareController,
  deleteDocumentShareController,
  getDocumentShareByIdController,
  getDocumentShareByTokenController,
  updateDocumentShareController,
} from "../controllers/document-share.controller.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

router.post(
  "/",
  protect,
  limiter("createDocumentShare"),
  createDocumentShareController,
);

router.get(
  "/:token",
  protect,
  limiter("getDocumentShareByToken"),
  getDocumentShareByTokenController,
);
router.get(
  "/:id/public",
  limiter("getDocumentShareById"),
  getDocumentShareByIdController,
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
