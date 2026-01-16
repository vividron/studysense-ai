import api from "./config/axios";
import API_PATHS from "./utils/apiPaths";
import errorHandler from "./utils/errorHandler";

// get detail overview of user activity 
export const getActivityOverview = async () => {
    try {
        const { data } = await api.get(API_PATHS.MY_ACTIVITY.GET_ACTIVITY);
        return data;
    } catch (error) {
        throw errorHandler(error);
    }
};