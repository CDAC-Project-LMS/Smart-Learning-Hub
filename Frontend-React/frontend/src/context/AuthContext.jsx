import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('slh_user');
    const storedToken = localStorage.getItem('slh_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const persistSession = (authResponse) => {
    const { token, ...userInfo } = authResponse;
    localStorage.setItem('slh_token', token);
    localStorage.setItem('slh_user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    persistSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    authApi.logout().catch(() => {
      /* stateless JWT - ignore network errors on logout */
    });
    localStorage.removeItem('slh_token');
    localStorage.removeItem('slh_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
