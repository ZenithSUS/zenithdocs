import { Request } from "express";

export const extractRequestMeta = (req: Request) => {
  const device =
    (req.headers["x-forwarded-user-agent"] as string) ||
    req.headers["user-agent"] ||
    "unknown";

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    "unknown";

  return { device, ip };
};
