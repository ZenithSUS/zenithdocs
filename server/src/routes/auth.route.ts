import { Router } from "express";
import protect from "../middlewares/protect.middleware.js";
import {
  loginController,
  registerUserController,
  getMeController,
  refreshAccessTokenController,
  logoutController,
  oauthLoginController,
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import config from "../config/env.js";
import rateLimit from "../middlewares/ratelimit.middleware.js";

const router = Router();

// Authentication routes
router.post("/login", rateLimit("login"), loginController);

router.post("/register", rateLimit("register"), registerUserController);

router.post("/logout", rateLimit("logout"), logoutController);

router.post(
  "/refresh",
  rateLimit("refreshToken"),
  refreshAccessTokenController,
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  rateLimit("oauthLogin"),
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.client.baseUrl}/login`,
  }),
  oauthLoginController,
);

router.get("/me", protect, rateLimit("fetchMe"), getMeController);

export default router;
