import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await axios.post(`${apiUrl}/api/users/register`, { username, password });
            navigate('/login');
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Registration error:', error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister} className="form">
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
                <button type="submit" className="form-button">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RegistrationPage;
