// const isDev = process.env.NODE_ENV === "development";

const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
    key: process.env.NEXT_PUBLIC_API_KEY ?? "",
  },
};

export type Config = typeof config;

export default config;
