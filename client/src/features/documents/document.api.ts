import { api } from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import Doc, { DocWithChat, UnifiedDoc } from "@/types/doc";

export const createDocument = async (data: Partial<Doc> & { file?: File }) => {
  const formData = new FormData();

  if (data.file) formData.append("file", data.file);
  if (data.title) formData.append("title", data.title);
  if (data.user) formData.append("user", data.user as string);
  if (data.folder) formData.append("folder", data.folder as string);
  // append other fields as needed

  const { data: res } = await api.post<ResponseWithData<Doc>>(
    "/api/documents",
    formData,
    { headers: { "Content-Type": "multipart/form-data" }, timeout: 60000 },
  );
  return res.data;
};

export const reprocessUploadedDocument = async (documentId: string) => {
  const { data: res } = await api.post<ResponseWithData<Doc>>(
    `/api/documents/${documentId}/reprocess`,
  );

  return res.data;
};

export const fetchDocumentByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<ResponseWithPagedData<Doc, "documents">>(
    `/api/documents/user/${userId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return res.data;
};

export const fetchDocumentByUserWithChatsPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<
    ResponseWithPagedData<DocWithChat, "documents">
  >(`/api/documents/user/${userId}`, {
    params: {
      page,
      limit,
      includeChats: true,
    },
  });

  return res.data;
};

export const fetchUnifiedDocumentsByUser = async (userId: string) => {
  const { data: res } = await api.get<ResponseWithData<UnifiedDoc>>(
    `/api/documents/unified/user/${userId}`,
  );

  return res.data;
};

export const fetchDocumentById = async (id: string) => {
  const { data: res } = await api.get<ResponseWithData<Doc>>(
    `/api/documents/${id}`,
  );
  return res.data;
};

export const updateDocumentById = async (id: string, data: Partial<Doc>) => {
  const { data: res } = await api.put<ResponseWithData<Doc>>(
    `/api/documents/${id}`,
    data,
  );
  return res.data;
};

export const deleteDocumentById = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<Doc>>(
    `/api/documents/${id}`,
  );
  return res.data;
};
