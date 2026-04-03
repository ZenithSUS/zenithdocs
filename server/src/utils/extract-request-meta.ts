import { Request } from "express";

export const extractRequestMeta = (req: Request) => {
  console.log(req.headers);
  const device =
    (req.headers["x-forwarded-user-agent"] as string) ||
    req.headers["user-agent"] ||
    "unknown";

  const rawIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    "unknown";

  const ip = rawIp === "::1" ? "127.0.0.1" : rawIp.replace(/^::ffff:/, "");

  return { device, ip };
};
