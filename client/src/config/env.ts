const isDev = process.env.NODE_ENV === "development";

const config = {
  api: {
    baseUrl: isDev
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL || "",
    key: process.env.NEXT_PUBLIC_API_KEY || "",
  },
};

export type Config = typeof config;

export default config;
