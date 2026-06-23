import { useState } from "react";

export function useAdminAuth() {
    const [token, setToken] = useState(null);
    const [showLogin, setShowLogin] = useState(false);

    const login = (token) => {
        setToken(token);
        setShowLogin(false);
    };

    const logout = () => {
        setToken(null);
    };

    const toggleLogin = () => {
        setShowLogin((v) => !v);
    };

    return {
        token,
        showLogin,
        login,
        logout,
        toggleLogin,
    };
}