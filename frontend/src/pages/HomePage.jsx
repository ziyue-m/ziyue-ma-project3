import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/statusUpdates`);
        setStatusUpdates(response.data);
      } catch (error) {
        console.error("Error fetching status updates", error);
      }
    };
  
    fetchStatusUpdates();
  }, [apiUrl]);

  return (
    <div className="container">
      <h1>Home Page</h1>
      {isLoggedIn && <button className="form-button">Add Status Update</button>}
      <div>
        {statusUpdates.length === 0 ? (
      <p>No status updates available.</p>
    ) : (
        statusUpdates.map(update => (
          <div key={update._id} className="status-update">
            <p>{update.user}: {update.text}</p>
            {update.imageUrl && <img src={update.imageUrl} alt="Status" />}
          </div>
        ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
