import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Navbar.css';

function Navbar() {
  const location = useLocation();

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
      </div>
    </nav>
  );
}

export default Navbar;