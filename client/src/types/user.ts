export type User = {
  _id: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  plan: string;
  createdAt: Date;
  updatedAt: Date;
  documentLimit: number;
  storageLimit: number;
  messagesPerDay: number;
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
