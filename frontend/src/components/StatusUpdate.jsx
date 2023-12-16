import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const StatusUpdate = () => {
    const [statusText, setStatusText] = useState('');
    const { user } = useContext(AuthContext);
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    const handlePostUpdate = async () => {
        if (statusText.trim()) {
            try {
                await axios.post(`${apiUrl}/api/statusUpdates`, { text: statusText, user: user._id }, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                setStatusText('');
            } catch (error) {
                console.error('Error posting status update:', error);
            }
        }
    };

    return (
        <div className="status-update">
            <textarea 
                className="status-textarea"
                value={statusText} 
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="What's happening?"
            ></textarea>
            <button onClick={handlePostUpdate} className="status-button">Post</button>
        </div>
    );
};

export default StatusUpdate;
