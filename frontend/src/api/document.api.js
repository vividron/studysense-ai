import axios from "axios";
import api from "./config/axios";
import API_PATHS from "./utils/apiPaths";
import errorHandler from "./utils/errorHandler";

// get uplaod signed url
export const getUploadUrl = async (fileName, fileType) => {
    try {
        const { data } = await api.post(API_PATHS.DOCUMENTS.GET_UPLOAD_URL, { fileName, fileType });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
}

// Upload document directly to s3 using presigned POST (fields + url)
export const uploadToS3 = async (signedPost, file) => {
    try {
        const formData = new FormData();
        // append all required fields from the presigned POST
        Object.entries(signedPost.fields).forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append('file', file);

        await axios.post(signedPost.url, formData);
    } catch (error) {
        throw new Error("Failed to upload document");
    }
}

// Notify backend to start parsing the pdf
export const processDocument = async (fileName, fileSize, fileKey, title) => {
    try {
        const { data } = await api.post(API_PATHS.DOCUMENTS.PROCESS_DOCUMENT, {
            fileName, fileSize, fileKey, title
        });
        return data

    } catch (error) {
        throw errorHandler(error);
    }
}


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