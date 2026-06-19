import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setUnauthorizedHandler } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [username, setUsername] = useState(() => localStorage.getItem('username'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setToken(null);
    setRole(null);
    setUsername(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      window.location.href = '/login';
    });
  }, [logout]);

  const persistAuth = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('username', data.username);
    setToken(data.token);
    setRole(data.role);
    setUsername(data.username);
  }, []);

  const login = useCallback(async (user, pass) => {
    const data = await api.login(user, pass);
    persistAuth(data);
    return data;
  }, [persistAuth]);

  const register = useCallback(async (data) => {
    const payload = await api.register(data);
    persistAuth(payload);
    return payload;
  }, [persistAuth]);

  const value = useMemo(
    () => ({
      token,
      role,
      username,
      isAuthenticated: !!token,
      isAdmin: role === 'admin',
      login,
      register,
      logout,
    }),
    [token, role, username, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
