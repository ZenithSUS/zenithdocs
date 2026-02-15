const isDev = process.env.NODE_ENV === "development";

const config = {
  API_URL: isDev
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL,
};

const requiredEnvVars = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_API_URL_DEV"];

// Check if the required environment variables are set
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

export type Config = typeof config;

export default config;
