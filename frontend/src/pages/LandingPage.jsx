import React from 'react';
import { Link } from 'react-router-dom';
import './css/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to NotNotion</h1>
      <p>Your simple, powerful note-taking app</p>
      
      <Link to="/app">
        <button className="get-started-button">
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default LandingPage;
