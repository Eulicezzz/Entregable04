import { createContext, useState, useCallback, useMemo } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // CAMBIO: Forzamos false al inicio para que SIEMPRE pida login
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  }, []);

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};