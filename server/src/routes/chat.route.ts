import {
  chatController,
  getChatByDocumentController,
  getChatByUserPaginatedController,
  initChatForDocumentController,
} from "../controllers/chat.controller.js";
import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import limiter from "../middlewares/express-limiter.middleware.js";

const router = Router();

router.post("/", protect, limiter("createChat"), chatController);
router.post(
  "/document/:id/init",
  protect,
  limiter("initChatForDocument"),
  initChatForDocumentController,
);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("getChatByUserPaginated"),
  getChatByUserPaginatedController,
);
router.get(
  "/document/:id",
  protect,
  limiter("getChatByDocument"),
  getChatByDocumentController,
);

export default router;
