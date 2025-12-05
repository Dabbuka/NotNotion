import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Navbar.css';

function Navbar() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    setCurrentUser(user);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          NotNotion
        </Link>
      </div>
      
      <div className="navbar-links">
        <Link 
          to="/home" 
          className={`navbar-link ${location.pathname === '/home' ? 'active' : ''}`}
        >
          Home
        </Link>
        {!currentUser && ( //change the conditional if you want to show the login and register buttons while signed in
          <>
            <Link 
              to="/login" 
              className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`navbar-link navbar-link-register ${location.pathname === '/register' ? 'active' : ''}`}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

