import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetchCurrentUser();
        setUser(res.data);
      } catch (err) {
        console.warn('Session expired or invalid, continuing as guest:', err);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      // Require explicit login first
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthModalOpen(false);
      return res.data.user;
    }
  };

  const demoLogin = async () => {
    return await login('demo@ventureai.com', 'venture123');
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthModalOpen(false);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await fetchCurrentUser();
      if (res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}