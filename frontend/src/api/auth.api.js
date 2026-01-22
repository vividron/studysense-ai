import api from "./config/axios";
import API_PATHS from "./utils/apiPaths";
import errorHandler from "./utils/errorHandler";

// Sign up a new user
export const signup = async (username, email, password) => {
    try {
        const { data } = await api.post(API_PATHS.AUTH.REGISTER, { username, email, password });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// Sign in user
export const signin = async (email, password) => {
    try {
        const { data } = await api.post(API_PATHS.AUTH.LOGIN, { email, password });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// Get logged-in user profile
export const getProfile = async () => {
    try {
        const { data } = await api.get(API_PATHS.AUTH.GET_PROFILE);
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// Update user profile
export const updateProfile = async (userData) => {
    try {
        const { data } = await api.put(API_PATHS.AUTH.UPDATE_PROFILE, { ...userData });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const { data } = await api.post(API_PATHS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};