import { Document } from "@/model/Document";
import { Category } from "@/model/Category";
import { api } from "./ApiService";

const DocumentService = {
  getDocumentById: (id: string) => api.get<Document>(`/document/${encodeURIComponent(id)}`),
  getDocumentByTypeAndCommunity: (communityId: string, typeId?: string) => api.get<Document[]>("/document/getAllByCommunityId", {
    communityId, ...(typeId ? { typeId } : {}),
  }),
  getCategories: () => api.get<Category[]>("/category/getAll"),
  createDocument: (data: Document) => api.post<Document>("/document/save", { ...data, documentId: "" }),
  upsertDocument: (data: Document) => api.post<Document>("/document/save", data),
  deleteDocument: (id: string) => api.delete<number>(`/document/${encodeURIComponent(id)}`),
};
export default DocumentService;
