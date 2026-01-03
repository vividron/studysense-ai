import api from "./config/axios";
import API_PATHS from "./apiPaths";

// Generate quiz from document
export const generateQuiz = async (documentId) => {
    try {
        const { data } = await api.post(API_PATHS.AI.GENERATE_QUIZ, {documentId});
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

// generate summary of document
export const generateSummary = async (documentId) => {
    try {
        const { data } = await api.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId});
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

export const chat = async (documentId, question) => {
    try {
        const { data } = await api.post(API_PATHS.AI.CHAT, {
            documentId,
            question
        });
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

export const getChatHistory = async (documentId) => {
    try {
        const { data } = await api.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

export const getSummary = async (documentId) => {
    try {
        const { data } = await api.get(API_PATHS.AI.GET_SUMMARY(documentId));
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};