import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  createLearningSetController,
  deleteLearningSetController,
  getLearningSetByIdController,
  getLearningSetsByUserPaginated,
  updateLearningSetController,
} from "../controllers/learning-set.controller.js";
import authorizeSelfOrAdmin from "../middlewares/authorize-self-or-admin.middleware.js";
import limiter from "../middlewares/limiter.middleware.js";

const router = Router();

router.get(
  "/:id",
  protect,
  limiter("getLearningSetById"),
  getLearningSetByIdController,
);
router.get(
  "/user/:id",
  protect,
  authorizeSelfOrAdmin,
  limiter("getLearningSetsByUserIdPaginated"),
  getLearningSetsByUserPaginated,
);

router.post(
  "/",
  protect,
  limiter("createLearningSet"),
  createLearningSetController,
);

router.put(
  "/:id",
  protect,
  limiter("updateLearningSet"),
  updateLearningSetController,
);

router.delete(
  "/:id",
  protect,
  limiter("deleteLearningSet"),
  deleteLearningSetController,
);

export default router;
