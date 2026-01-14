import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../api/auth.api.js";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                const parsedUser = JSON.parse(userStr);
                const userData = await validateStreak(parsedUser);
                setUser(userData);
                setIsAuthenticated(true);
            }
            else {
                console.error("Authentication check failed:" + error);
                logout();
            }
        } catch (error) {
            console.error("Authentication check failed:" + error);
            logout();
        } finally {
            setLoading(false);
        }
    }

    const validateStreak = async (userData) => {
        try {
            if (!userData?.streakDate) return userData;

            const lastDate = new Date(userData.streakDate).toLocaleDateString("en-CA");
            const today = new Date().toLocaleDateString("en-CA");

            const diff = (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24);

            if (diff > 1) {
                const res = await authService.updateProfile({
                    streak: 0,
                    streakDate: null
                });
                return res.user;
            }
            return userData;
        } catch (error) {
            console.error("Failed to validate streak" + error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
    }

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true)
    }

    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuthStatus,
        updateUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}