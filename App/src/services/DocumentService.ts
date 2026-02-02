import { Document } from "@/model/Document";
import { api } from "./ApiService";
import Constants from "@/config/Constants";
const DocumentService = {
  getDocumentById: async (id: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with ID: ${id}`);
    return await api.get<Document>(`/document/${id}`);
  },

  getDocumentByBasisType: async (basisId: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with BASIS ID: ${basisId}`);
    const data = await api.get<Document[]>(Constants.API_DOCUMENT_GET_ALL);
    return data;
  },

  getDocumentByCaseType: async (caseId: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with CASE ID: ${caseId}`);
    const data = await api.get<Document[]>(Constants.API_DOCUMENT_GET_ALL);
    return data;
  },

  getDocumentByPostType: async (postId: string) => {
    // Implementation to fetch a document by its ID
    console.log(`Fetching document with POST ID: ${postId}`);
    const data = await api.get<Document[]>(Constants.API_DOCUMENT_GET_ALL);
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
