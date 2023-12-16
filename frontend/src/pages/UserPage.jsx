import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserPage = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
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
    };
  
    fetchUserDetails();
  }, [username, apiUrl]);

  return (
    <div className="container">
      <h1>User: {username}</h1>
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
                <p>{update.text}</p>
                {update.imageUrl && <img src={update.imageUrl} alt="Status" style={{ maxWidth: "500px" }}/>}
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