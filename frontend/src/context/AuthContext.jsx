import {createContext, useState, useEffect} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    // Intentamos recuperar el token del localStorage al iniciar la aplicación
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};