import {
  chatController,
  deleteChatMessagesController,
  getChatByDocumentController,
} from "../controllers/chat.controller.js";
import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";

const router = Router();

router.post("/", protect, chatController);
router.get("/document/:id", protect, getChatByDocumentController);
router.delete("/:id", protect, deleteChatMessagesController);

export default router;
