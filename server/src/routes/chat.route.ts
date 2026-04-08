import {
  chatController,
  chatPublicController,
  getChatByDocumentController,
  getChatByUserPaginatedController,
  initChatForDocumentController,
} from "../controllers/chat.controller.js";
import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import limiter from "../middlewares/limiter.middleware.js";
import validateDocument from "../middlewares/validate-document.js";
import checkMessageLimit from "../middlewares/check-message-limit.js";

const router = Router();

router.post(
  "/",
  protect,
  validateDocument,
  checkMessageLimit,
  limiter("createChat"),
  chatController,
);
router.post("/public", limiter("createPublicChat"), chatPublicController);
router.post(
  "/document/:id/init",
  protect,
  validateDocument,
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
