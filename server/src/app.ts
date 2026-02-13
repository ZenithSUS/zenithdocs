import express from "express";
import header from "./middleware/headers";
import helmet from "helmet";
import cors from "cors";
import config from "./config/env";

const app = express();

const origins = config.allowedOrigins.split(",");

// Express Middleware Config
app.use(header);
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

export default app;
