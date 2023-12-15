import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchStatusUpdates = async () => {
      try {
        const response = await axios.get('/api/statusUpdates');
        setStatusUpdates(response.data);
      } catch (error) {
        console.error("Error fetching status updates", error);
      }
    };
  
    fetchStatusUpdates();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {isLoggedIn && <button>Add Status Update</button>}
      <div>
        {statusUpdates.map(update => (
          <div key={update._id}>
            <p>{update.user}: {update.text}</p>
            {update.imageUrl && <img src={update.imageUrl} alt="Status" style={{maxWidth: "500px"}}/>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
