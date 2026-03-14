import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  deleteGlobalMessagesByChatAndUserIdController,
  getGlobalMessagesByChatIdPaginatedController,
} from "../controllers/global-messsage.controller.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

router.get(
  "/chat/:id",
  protect,
  limiter("getGlobalMessagesByChatPaginated"),
  getGlobalMessagesByChatIdPaginatedController,
);
router.delete(
  "/chat/:id",
  protect,
  limiter("deleteGlobalMessagesByChatAndUser"),
  deleteGlobalMessagesByChatAndUserIdController,
);

export default router;
