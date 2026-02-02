import { Document } from "@/model/Document";
import { api } from "./ApiService";
import Constants from "@/config/Constants";
const DocumentService = {
  getDocumentById: async (id: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with ID: ${id}`);
    return await api.get<Document>(`/document/${id}`);
  },

  getDocumentByBasisType: async (baseId: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with BASE ID: ${baseId}`);
    const data = await api.get<Document[]>(Constants.API_COMMUNITY_GET_ALL);
    return data;
  },

  getDocumentByCaseType: async (baseId: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with BASE ID: ${baseId}`);
    const data = await api.get<Document[]>(Constants.API_DOCUMENT_GET_ALL);
    return data;
  },

  getDocumentByPostType: async (baseId: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with BASE ID: ${baseId}`);
    const data = await api.get<Document[]>("/api/document/get", { baseId });
    return data;
  },

  createDocument: async (data: any) => {
    // Implementation to create a new document
    console.log("Creating a new document with data:", data);
  },

  upsertDocument: async (data: Document) => {
    // Implementation to update an existing document
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
