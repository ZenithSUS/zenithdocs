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
import MongoStore from "connect-mongo";

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
import dashboardRouter from "./routes/dashboard.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import globalChatRouter from "./routes/global-chat.route.js";
import globalMessageRouter from "./routes/global-message.route.js";

// Passport
import session from "express-session";
import passport from "./config/passport.js";

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const origins = config.server.allowedOrigins.split(",");

// Express App
const app = express();

// Set Trust Proxy
app.set("trust proxy", 1);

// Express Middleware Config
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
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
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());
app.use((req, res, next) => {
  if (req.path.includes("/api/chat")) return next();
  compression()(req, res, next);
});
app.use(requestLogger);
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.database.mongoURI,
      dbName: "zenithdocs",
      collectionName: "sessions",
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.nodeEnv === "production" },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

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

// Cookie Test
app.get("/api/auth/cookie-test", (req, res) => {
  res.json({
    success: true,
    message: "Cookies are working",
    cookies: req.cookies,
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", requireApiKey, userRouter);
app.use("/api/documents", requireApiKey, documentRouter);
app.use("/api/folders", requireApiKey, folderRouter);
app.use("/api/summaries", requireApiKey, summaryRouter);
app.use("/api/usages", requireApiKey, usageRouter);
app.use("/api/dashboard", requireApiKey, dashboardRouter);
app.use("/api/chat", requireApiKey, chatRouter);
app.use("/api/messages", requireApiKey, messageRouter);
app.use("/api/global-chats", requireApiKey, globalChatRouter);
app.use("/api/global-messages", requireApiKey, globalMessageRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
