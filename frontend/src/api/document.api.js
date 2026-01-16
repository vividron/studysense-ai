import api from "./config/axios";
import API_PATHS from "./utils/apiPaths";
import errorHandler from "./utils/errorHandler";

// uplaod document
export const uploadDocument = async (formData) => {
    try {
        const { data } = await api.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// get all documents
export const getDocuments = async () => {
    try {
        const { data } = await api.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// get document by id
export const getDocumentById = async (documentId) => {
    try {
        const { data } = await api.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(documentId));
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// delete document
export const deleteDocument = async (documentId) => {
    try {
        const { data } = await api.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(documentId));
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};