const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/signup",
        LOGIN: "/api/auth/signin",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/profile",
        CHANGE_PASSWORD: "/api/auth/change-password",
    },
    DOCUMENTS: {
        UPLOAD: "/api/documents/upload",
        GET_DOCUMENTS: "api/documents",
        GET_DOCUMENT_BY_ID: (id) => `/api/documents/${id}`,
        DELETE_DOCUMENT: (id) => `/api/documents/${id}`
    },
    AI: {
        GENERATE_QUIZ: "/api/ai/generate-quiz",
        GENERATE_SUMMARY: "/api/ai/generate-summary",
        CHAT: "/api/ai/chat",
        GET_SUMMARY: (documentId) => `/api/ai/summary/${documentId}`,
        GET_CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
        DELETE_CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
    },
    QUIZZES: {
        GET_QUIZZES_FOR_DOC: (documentId) => `/api/quizzes/${documentId}`,
        GET_QUIZ_BY_ID: (id) => `/api/quizzes/quiz/${id}`,
        SUBMIT_QUIZ: (id) => `/api/quizzes/${id}/submit`,
        GET_QUIZ_RESULTS: (id) => `/api/quizzes/${id}/result`,
        DELETE_QUIZ: (id) => `/api/quizzes/${id}`,
    },
    MY_ACTIVITY: {
        GET_ACTIVITY: "/api/activity",
    },
};

export default API_PATHS;