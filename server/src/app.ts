// Dependencies
import express from "express";
import helmet from "helmet";
import cors from "cors";
import config from "./config/env.js";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import compression from "compression";
import path from "path";
import favicon from "serve-favicon";
import { fileURLToPath } from "url";

// Middlewares
import requestLogger from "./middlewares/request-logger.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import requireApiKey from "./middlewares/require-api-key.middleware.js";

// Routers
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import documentRouter from "./routes/document.route.js";
import folderRouter from "./routes/folder.route.js";
import summaryRouter from "./routes/summary.route.js";
import usageRouter from "./routes/usage.route.js";

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const origins = config.server.allowedOrigins.split(",");

// Express App
const app = express();

// Express Middleware Config
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());
app.use(compression());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Health Check
app.get("/health", (_, res) =>
  res
    .status(200)
    .json({ success: true, message: "ZenithDocs Server is Healthy" }),
);

// Home Page
app.get("/", (_, res) =>
  res
    .status(200)
    .json({ success: true, message: "Welcome to the ZenithDocs Server" }),
);

// Routes
app.use("/api/auth", requireApiKey, authRouter);
app.use("/api/users", requireApiKey, userRouter);
app.use("/api/documents", requireApiKey, documentRouter);
app.use("/api/folders", requireApiKey, folderRouter);
app.use("/api/summaries", requireApiKey, summaryRouter);
app.use("/api/usage", requireApiKey, usageRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
