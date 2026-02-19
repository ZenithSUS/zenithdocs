export type User = {
  _id: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  tokensUsed: number;
  plan: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  sub: string;
  role: string;
};
