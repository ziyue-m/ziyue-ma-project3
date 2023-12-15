import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('/api/users/current', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      }
      setLoading(false);
    };

    checkLogin();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/users/login', { username, password });
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user); 
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};