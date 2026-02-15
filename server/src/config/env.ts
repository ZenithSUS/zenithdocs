import "dotenv/config";
import colors from "../utils/log-colors";

const config = {
  server: {
    port: process.env.PORT || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS || "http://localhost:5000",
    apikey: process.env.API_KEY || "",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
  },
  ai: {
    mistralai: process.env.MISTRALAI_API_KEY || "",
  },
  database: {
    mongoURI:
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI
        : process.env.MONGODB_URI_DEV || "",
  },
};

// Check if the required environment variables are set
const requiredEnvVars = [
  "MISTRALAI_API_KEY",
  "MONGODB_URI_DEV",
  "ALLOWED_ORIGINS",
  "API_KEY",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

export default config;
