import "dotenv/config";

const config = {
  server: {
    port: process.env.PORT || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS || "http://localhost:5000",
    apikey: process.env.API_KEY || "",
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
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

export default config;
