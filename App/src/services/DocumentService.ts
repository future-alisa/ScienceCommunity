import { Document } from "@/model/Document";
import { api } from "./ApiService";
const DocumentService = {
  getDocumentById: (id: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with ID: ${id}`);
  },

  getDocumentByBaseId: async (baseId: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with BASE ID: ${baseId}`);
    const data = await api.get<Document[]>("/api/document/get", { baseId });
    return data;
  },

  createDocument: (data: any) => {
    // Implementation to create a new document
    console.log("Creating a new document with data:", data);
  },

  updateDocument: (id: string, data: any) => {
    // Implementation to update an existing document
    console.log(`Updating document with ID: ${id} with data:`, data);
  },

  deleteDocument: (id: string) => {
    // Implementation to delete a document by its ID
    console.log(`Deleting document with ID: ${id}`);
  },
};

export default DocumentService;
