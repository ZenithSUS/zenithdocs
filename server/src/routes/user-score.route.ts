import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  createUserScoreController,
  deleteUserScoreController,
  getUserScoreByIdController,
  getUserScoreByUserAndLearningSetIdController,
  updateUserScoreController,
} from "../controllers/user-score.controller.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

router.get(
  "/:id",
  protect,
  limiter("getUserScoreById"),
  getUserScoreByIdController,
);

router.get(
  "/user/:userId/learning-sets/:learningSetId",
  protect,
  limiter("getUserScoreByUserAndLearningSetId"),
  getUserScoreByUserAndLearningSetIdController,
);

router.post(
  "/",
  protect,
  limiter("createUserScore"),
  createUserScoreController,
);

router.put(
  "/:id",
  protect,
  limiter("updateUserScore"),
  updateUserScoreController,
);

router.delete(
  "/:id",
  protect,
  limiter("deleteUserScore"),
  deleteUserScoreController,
);

export default router;
