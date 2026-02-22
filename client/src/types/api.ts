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

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ResponseWithUser = {
  success: boolean;
  message: string;
  data: User;
};

export type ResponseWithData<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ResponseWithPagedData<T, K extends string> = {
  success: boolean;
  message: string;
  data: {
    [P in K]: T[];
  } & {
    pagination: Pagination;
  };
};
