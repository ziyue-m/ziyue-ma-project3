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

  const setAuthToken = (token) => {
    localStorage.setItem('token', token);
    // Additional logic to set the user if needed
  };

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
          setAuthToken(localStorage.getItem('token'));
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
          setAuthToken(response.data.token);
          setUser(response.data.user);
          navigate('/');
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
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, setAuthToken}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};