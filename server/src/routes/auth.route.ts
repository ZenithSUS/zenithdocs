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

const router = Router();

// Authentication routes
router.post("/login", loginController);
router.post("/register", registerUserController);
router.post("/logout", logoutController);
router.post("/refresh", refreshAccessTokenController);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.client.baseUrl}/login`,
  }),
  oauthLoginController,
);

// Get current user
router.get("/me", protect, getMeController);

export default router;
