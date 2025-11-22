import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>
      <h1>Welcome to NotNotion</h1>
      <p>To be stylized later</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        {/* These Links swap the component without reloading the page */}
        <Link to="/login">
          <button style={{backgroundColor: '#646'}}>Login</button>
        </Link>
        
        <Link to="/register">
          <button style={{backgroundColor: '#646'}}>Register</button>
        </Link>
        
        <Link to="/app">
          <button style={{ backgroundColor: '#646' }}>Go to Notes (Demo)</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;