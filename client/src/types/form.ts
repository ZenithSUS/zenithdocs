import { UseFormSetError } from "react-hook-form";

export type UseFormOptions<T> = {
  setError?: UseFormSetError<Partial<T>>;
};
