import api from "./config/axios";
import API_PATHS from "./apiPaths";

// get all the quizzes for specific document
export const getQuizzes = async (documentId) => {
    try {
        const { data } = await api.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

// get specific quiz of the document
export const getQuizById = async (documentId) => {
    try {
        const { data } = await api.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(documentId));
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

// Submit the quiz
export const submitQuiz = async (documentId, answers) => {
    try {
        const { data } = await api.post(API_PATHS.QUIZZES.SUBMIT_QUIZ, {
            documentId,
            answers
        });
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

// get quiz result
export const getQuizResult = async (documentId) => {
    try {
        const { data } = await api.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(documentId));
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};

// delete the quiz
export const deleteQuiz = async (documentId) => {
    try {
        const { data } = await api.delete(API_PATHS.QUIZZES.DELETE_QUIZ(documentId));
        return data;
    } catch (error) {
        throw { message: error.response?.data.error || "Unexpected error occurred" };
    }
};