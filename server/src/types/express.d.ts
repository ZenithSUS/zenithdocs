declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
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
}
