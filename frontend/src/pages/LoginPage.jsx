import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setAuthToken, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${apiUrl}/api/users/login`, { username, password });
            console.log('Login response:', response);
            if (response.data && response.data.token) {
                setAuthToken(response.data.token);
                setUser(response.data.user);
                navigate(`/user/${username}`);
            } else {
                // Handle unexpected response structure
                setError('Unexpected response from server.');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                // Handle other types of errors (network error, etc.)
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="form">
                <input 
                    type="text" 
                    className="form-input"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                    required 
                />
                <input 
                    type="password" 
                    className="form-input"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit" className="form-button">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
