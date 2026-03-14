import { Router } from "express";
import {
  deleteGlobalChatByUserController,
  getGlobalChatByUserController,
  globalChatController,
  initGlobalChatController,
} from "../controllers/global-chat.controller.js";
import protect from "../middlewares/protect.middleware.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import limiter from "../middlewares/express-limiter.middleware.js";

const router = Router();

router.post(
  "/init",
  protect,
  limiter("initGlobalChat"),
  initGlobalChatController,
);
router.post("/", protect, limiter("createGlobalChat"), globalChatController);

router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("getGlobalChatByUser"),
  getGlobalChatByUserController,
);

router.delete(
  "/user/:id",
  protect,
  limiter("deleteGlobalChatByUser"),
  deleteGlobalChatByUserController,
);

export default router;
