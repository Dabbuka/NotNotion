import React from 'react';
import { Link } from 'react-router-dom';
import './css/LandingPage.css';
const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to NotNotion</h1>
      <p>To be stylized later</p>
      
      <div className="clickable-buttons">
        {/* Change to a different page without reloading, more efficient than an href */}
        <Link to="/login">
          <button className="redirect-buttons">Login</button>
        </Link>
        
        <Link to="/register">
          <button className="redirect-buttons">Register</button>
        </Link>
        
        <Link to="/app">
          <button className="redirect-buttons">Go to Notes</button>
        </Link>

        <Link to="/home">
          <button className="redirect-buttons">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;