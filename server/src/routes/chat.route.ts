import {
  chatController,
  deleteChatMessagesController,
  getChatByDocumentController,
  getChatByUserPaginatedController,
  initChatForDocumentController,
} from "../controllers/chat.controller.js";
import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";

const router = Router();

router.post("/", protect, chatController);
router.post("/document/:id/init", protect, initChatForDocumentController);
router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  getChatByUserPaginatedController,
);
router.get("/document/:id", protect, getChatByDocumentController);
router.delete("/message/:id", protect, deleteChatMessagesController);

export default router;
