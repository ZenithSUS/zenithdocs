import userKeys from "./user.keys";
import { useMutation } from "@tanstack/react-query";
import { matchUserByEmail } from "./user.api";
import { User } from "@/types/user";
import { AxiosError } from "@/types/api";

export const useUserMatchByEmail = (email: string) =>
  useMutation<Pick<User, "_id" | "email">, AxiosError>({
    mutationKey: userKeys.matchByEmail(email),
    mutationFn: () => matchUserByEmail(email),
  });
