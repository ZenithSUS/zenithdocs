import { Router } from "express";
import {
  deleteMessagesByChatIdAndUserController,
  getMessagesByChatIdPaginatedController,
} from "../controllers/message.controller.js";
import protect from "../middlewares/protect.middleware.js";

const router = Router();

router.get("/chat/:id", protect, getMessagesByChatIdPaginatedController);
router.delete("/chat/:id", protect, deleteMessagesByChatIdAndUserController);

export default router;
