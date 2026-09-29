import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexoura_token'));
  const [loading, setLoading] = useState(true);

  // Validate active token & fetch profile on load
  const initAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('nexoura_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    const res = await apiService.getMe();
    if (res.success) {
      setUser(res.data);
      setToken(savedToken);
    } else {
      // Expired or invalid token
      localStorage.removeItem('nexoura_token');
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Login handler
  const login = async (email, password) => {
    const res = await apiService.login(email, password);
    if (res.success) {
      const { access_token, user: userData } = res.data;
      localStorage.setItem('nexoura_token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, error: res.error };
  };

  // Student Registration
  const registerStudent = async (data) => {
    const res = await apiService.registerStudent(data);
    if (res.success) {
      const { access_token, user: userData } = res.data;
      localStorage.setItem('nexoura_token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, error: res.error };
  };

  // Teacher Registration
  const registerTeacher = async (data) => {
    const res = await apiService.registerTeacher(data);
    if (res.success) {
      const { access_token, user: userData } = res.data;
      localStorage.setItem('nexoura_token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, error: res.error };
  };

  // Parent Registration
  const registerParent = async (data) => {
    const res = await apiService.registerParent(data);
    if (res.success) {
      const { access_token, user: userData } = res.data;
      localStorage.setItem('nexoura_token', access_token);
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, error: res.error };
  };

  // Logout handler
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // ignore logout network errors
    } finally {
      localStorage.removeItem('nexoura_token');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role: user?.role,
        login,
        logout,
        registerStudent,
        registerTeacher,
        registerParent,
        refreshUser: initAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
