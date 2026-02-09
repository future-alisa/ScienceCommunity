import { Document } from "@/model/Document";
import { api } from "./ApiService";
import Constants from "@/config/Constants";
const DocumentService = {
  getDocumentById: async (id: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with ID: ${id}`);
    return await api.get<Document>(`/document/${id}`);
  },

  getDocumentByTypeAndCommunity: async (
    communityId: string,
    typeId: string
  ) => {
    console.log(`Fetching document with type ID: ${typeId}`);
    const data = await api.get<Document[]>(
      Constants.API_DOCUMENT_GET_ALL_TYPE_ID,
      { communityId: communityId, typeId: typeId }
    );
    return data;
  },

  createDocument: async (data: any) => {
    console.log("Creating a new document with data:", data);
  },

  upsertDocument: async (data: Document) => {
    console.log(
      `Updating document with ID: ${data.documentId} with data:`,
      data
    );
    const res = await api.post(Constants.API_DOCUMENT_UPSERT, data);
  },

  deleteDocument: async (id: string) => {
    // Implementation to delete a document by its ID
    console.log(`Deleting document with ID: ${id}`);
  },
};

export default DocumentService;
