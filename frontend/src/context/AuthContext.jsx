import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (checked) return;

    const checkLogin = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/current`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        } else {
          console.error("Auth check failed", error);
        }
      } finally {
        setLoading(false);
        setChecked(true);
      }
    };

    checkLogin();
  }, [apiUrl, checked, navigate]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, { username, password });
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