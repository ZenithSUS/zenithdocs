import "dotenv/config";

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  server: {
    port: process.env.PORT || 3000,
    allowedOrigins: process.env.ALLOWED_ORIGINS || "http://localhost:5000",
    apikey: process.env.API_KEY || "",
    backendUrl:
      process.env.NODE_ENV === "development"
        ? process.env.BACKEND_URL_DEV
        : process.env.BACKEND_URL || "",
  },
  client: {
    baseUrl:
      process.env.NODE_ENV === "development"
        ? process.env.CLIENT_URL_DEV
        : process.env.CLIENT_URL || "",
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
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "",
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
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "BACKEND_URL_DEV",
  "BACKEND_URL",
  "CLIENT_URL_DEV",
  "CLIENT_URL",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

export default config;
