import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
      <nav>
          <Link to="/" className="nav-link">Home</Link>
          {isLoggedIn ? (
              <>
                  <span className="nav-user">{user.username}</span>
                  <button onClick={logout} className="nav-button">Logout</button>
              </>
          ) : (
              <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>
              </>
          )}
      </nav>
    );
};

export default Navbar;