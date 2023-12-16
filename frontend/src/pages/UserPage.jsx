import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StatusUpdate from '../components/StatusUpdate';

const UserPage = () => {
    const { username } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [statusUpdates, setStatusUpdates] = useState([]);
    const [error, setError] = useState('');
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const [editingText, setEditingText] = useState({});
    const [isEditing, setIsEditing] = useState({});

    const fetchUserDetailsAndStatusUpdates = useCallback(async () => {
        const token = localStorage.getItem('token');
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            const userDetailsResponse = await axios.get(`${apiUrl}/api/users/${username}`, { headers: authHeaders });
            setUserDetails(userDetailsResponse.data);

            const statusUpdatesResponse = await axios.get(`${apiUrl}/api/statusUpdates/user/${username}`, { headers: authHeaders });
            setStatusUpdates(statusUpdatesResponse.data);
        } catch (error) {
            setError('Error fetching user details or status updates.');
            console.error("Error fetching data", error);
        }
    }, [apiUrl, username]); 

    useEffect(() => {
        fetchUserDetailsAndStatusUpdates();
    }, [fetchUserDetailsAndStatusUpdates]); // fetchUserDetailsAndStatusUpdates 作为依赖项

    
    const refreshStatusUpdates = () => {
        fetchUserDetailsAndStatusUpdates();
    };

    const handleUpdate = async (updateId, newText) => {
      try {
          await axios.put(`${apiUrl}/api/statusUpdates/${updateId}`, { text: newText }, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          refreshStatusUpdates();  
      } catch (error) {
          console.error("Error updating status update", error);
      }
  };

  const handleDelete = async (updateId) => {
      try {
          await axios.delete(`${apiUrl}/api/statusUpdates/${updateId}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          refreshStatusUpdates(); 
      } catch (error) {
          console.error("Error deleting status update", error);
      }
  };

  const handleEdit = (updateId) => {
    setIsEditing({ ...isEditing, [updateId]: true });
    setEditingText({ ...editingText, [updateId]: statusUpdates.find(u => u._id === updateId).text });
  };

  const handleSave = async (updateId) => {
      setIsEditing({ ...isEditing, [updateId]: false });
      await handleUpdate(updateId, editingText[updateId]);
  };

    return (
        <div className="container">
            <h1>User: {username}</h1>
            <StatusUpdate onPostSuccess={refreshStatusUpdates} />
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : userDetails ? (
                <div className="user-details">
                    <p>Username: {userDetails.username}</p>
                    <p>Joined: {new Date(userDetails.joined).toLocaleDateString()}</p>
                    <div>
                <h2>Status Updates:</h2>
                {statusUpdates.map(update => (
                    <div key={update._id} className="status-update">
                        {isEditing[update._id] ? (
                            <>
                                <textarea
                                    value={editingText[update._id]}
                                    onChange={(e) => setEditingText({ ...editingText, [update._id]: e.target.value })}
                                />
                                <button onClick={() => handleSave(update._id)}>Save</button>
                            </>
                        ) : (
                            <>
                                <p>{update.text}</p>
                                <button onClick={() => handleEdit(update._id)}>Edit</button>
                                <button onClick={() => window.confirm('Are you sure you want to delete this update?') && handleDelete(update._id)}>Delete</button>
                            </>
                        )}
                        {update.imageUrl && <img src={update.imageUrl} alt="Status" style={{ maxWidth: "500px" }} />}
                        </div>
                    ))}
                </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserPage;
