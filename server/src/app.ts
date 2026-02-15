// Dependencies
import express from "express";
import helmet from "helmet";
import cors from "cors";
import config from "./config/env";

// Middlewares
import header from "./middlewares/header.middleware";
import logger from "./middlewares/logger.middleware";
import notFound from "./middlewares/notFound.middleware";
import errorHandler from "./middlewares/error.middleware";
import apiKeyVerifier from "./middlewares/api-key-verifier.middleware";

// Routers
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";

const app = express();

const origins = config.server.allowedOrigins.split(",");

// Express Middleware Config
app.use(header);
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

// Health Check
app.get("/health", (req, res) => res.status(200).json({ success: true }));

// Root Route
app.get("/", (req, res) =>
  res
    .status(200)
    .json({ success: true, message: "Welcome to the ZenithDocs " }),
);

// Routes
app.use("/api/users", apiKeyVerifier, userRouter);
app.use("/api/auth", apiKeyVerifier, authRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
