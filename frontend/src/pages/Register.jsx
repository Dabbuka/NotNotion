import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register logic will go here:', formData);
  };

  // Reusing the same styles for consistency
  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#242424',
  };

  const boxStyle = {
    backgroundColor: '#333',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    width: '300px',
    textAlign: 'center',
    color: 'white'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: 'white'
  };

  return (
    <div style={pageStyle}>
      <div style={boxStyle}>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '20px', width: '100%' }}>
            Register
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '0.9em' }}>
          Already have an account? <Link to="/login" style={{ color: '#646cff' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;