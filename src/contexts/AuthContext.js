import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await ApiService.loginUser(credentials);
      const userData = response.user;
      const authToken = response.token;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await ApiService.registerUser(userData);
      const newUser = response.user;
      const authToken = response.token;
      
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', authToken);
      
      return newUser;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const setUserData = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
    setUserData,
    updateUser,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
