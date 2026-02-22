export type User = {
  _id: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  plan: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  tokenLimit: number;
  __v: number;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  sub: string;
  role: string;
};
