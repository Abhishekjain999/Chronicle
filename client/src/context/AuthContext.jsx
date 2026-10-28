import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session from HTTP-only cookie on mount
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      setUser(data.user);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      setUser(null);
      toast.error('Logout completed');
    }
  };

  // Update user in state
  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
