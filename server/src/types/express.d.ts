declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export interface JwtPayload {
  sub: string;
  role: string;
}
