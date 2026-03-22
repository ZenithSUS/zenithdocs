"use client";

import { useQuery } from "@tanstack/react-query";
import { searchUsersByEmail } from "./user.api";
import userKeys from "./user.keys";
import { User } from "@/types/user";
import { AxiosError } from "@/types/api";

const useUser = (searchQuery: string) => {
  const searchUsersByEmailQuery = useQuery<User[], AxiosError>({
    queryKey: userKeys.searchByEmail(searchQuery),
    queryFn: () => searchUsersByEmail(searchQuery),
    staleTime: 1000 * 30,
    enabled: searchQuery.length > 1,
  });

  return { searchUsersByEmailQuery };
};

export default useUser;
