declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      refreshTokenPayload: RefreshTokenPayload;
    }
  }
}

declare module "express-serve-static-core" {
  interface Response {
    responseData?: unknown;
  }
}

export interface JwtPayload {
  sub: string;
  role: "user" | "admin";
  plan: "free" | "premium" | "enterprise";
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}
