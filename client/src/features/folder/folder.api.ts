import api from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { Folder } from "@/types/folder";

export const createFolder = async (data: Partial<Folder>) => {
  const { data: res } = await api.post<ResponseWithData<Folder>>(
    "/api/folders",
    data,
  );
  return res.data;
};

export const fetchFoldersByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<ResponseWithPagedData<Folder, "folders">>(
    `/api/folders/user/${userId}/paginated`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return res.data;
};

export const fetchFolderById = async (id: string) => {
  const { data: res } = await api.get<ResponseWithData<Folder>>(
    `/api/folders/${id}`,
  );
  return res.data;
};

export const updateFolderById = async (id: string, data: Partial<Folder>) => {
  const { data: res } = await api.put<ResponseWithData<Folder>>(
    `/api/folders/${id}`,
    data,
  );
  return res.data;
};

export const deleteFolderById = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<Folder>>(
    `/api/folders/${id}`,
  );
  return res.data;
};
