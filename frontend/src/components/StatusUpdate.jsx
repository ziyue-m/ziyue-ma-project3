import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


const StatusUpdate = ({ onPostSuccess }) => {
    const [statusText, setStatusText] = useState('');
    const { user } = useContext(AuthContext);
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    console.log('Current user:', user);

    const handlePostUpdate = async () => {
        if (!statusText.trim()) return;
        if (!user) {
            console.error('No user logged in');
            return <p>Please login to post status updates.</p>;
        }
    
        try {
            await axios.post(`${apiUrl}/api/statusUpdates`, { text: statusText, user: user._id }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            setStatusText('');
            if(onPostSuccess) {
                onPostSuccess();
            }
        } catch (error) {
            console.error('Error posting status update:', error);
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
