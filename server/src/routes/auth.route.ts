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
import limiter from "../middlewares/express-limiter.middleware.js";

const router = Router();

// Authentication routes
router.post("/login", limiter("login"), loginController);

router.post("/register", limiter("register"), registerUserController);

router.post("/logout", limiter("logout"), logoutController);

router.post("/refresh", limiter("refreshToken"), refreshAccessTokenController);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  limiter("oauthLogin"),
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.client.baseUrl}/login`,
  }),
  oauthLoginController,
);

router.get("/me", protect, limiter("fetchMe"), getMeController);

export default router;
