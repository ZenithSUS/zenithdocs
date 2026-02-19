import { User } from "./user";

export type Response = {
  success: boolean;
  message: string;
};

export type AxiosError = {
  response: {
    data: {
      success: boolean;
      message: string;
    };
  };
};

export type ResponseWithUser = {
  success: boolean;
  message: string;
  data: User;
};
