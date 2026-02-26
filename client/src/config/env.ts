const config = {
  api: {
    key: process.env.NEXT_PUBLIC_API_KEY ?? "",
  },
};

export type Config = typeof config;

export default config;
