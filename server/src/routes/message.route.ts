import { Router } from "express";
import {
  deleteMessagesByChatIdAndUserController,
  getMessagesByChatIdPaginatedController,
} from "../controllers/message.controller.js";
import protect from "../middlewares/protect.middleware.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

router.get(
  "/chat/:id",
  protect,
  limiter("getMessagesByChatPaginated"),
  getMessagesByChatIdPaginatedController,
);

router.delete(
  "/chat/:id",
  protect,
  limiter("deleteMessagesByChatId"),
  deleteMessagesByChatIdAndUserController,
);

export default router;
