import api from "./config/axios";
import API_PATHS from "./apiPaths";

const errorHandler = (error) => {
    // Server responded with error
    if (error.response) {
        const data = error.response.data;

        // Validation errors (array)
        if (Array.isArray(data?.error)) {
            console.error(data.error);
            return {
                message: "Invalid inputs",
            };
        }

        // Normal API error (string)
        if (typeof data?.error === "string") {
            return {
                message: data.error,
            };
        }

        // server error
        return {
            message: "Server error occurred",
        };
    }

    // request made but no response 
    if (error.request) {
        return {
            message: "Unable to reach server. Check your internet connection.",
        };
    }

    return {
        message: error.message || "Unexpected error occurred",
    };
}


// Sign up a new user
export const signup = async (username, email, password) => {
    try {
        const { data } = await api.post(API_PATHS.AUTH.REGISTER, {
            username,
            email,
            password
        });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// Sign in user
export const signin = async (email, password) => {
    try {
        const { data } = await api.post(API_PATHS.AUTH.LOGIN, {
            email,
            password
        });
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
export const updateProfile = async (username, email) => {
    try {
        const { data } = await api.put(API_PATHS.AUTH.UPDATE_PROFILE, {
            username,
            email
        });
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const { data } = await api.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
            currentPassword,
            newPassword
        });
        return data;
    } catch (error) {
        errorHandler(error);
    }
};