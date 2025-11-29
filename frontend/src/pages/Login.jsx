import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Login.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => { //Login logic should go here.
    e.preventDefault();
    console.log('Skibidi', formData);
  };

  return (
    <div className="landing-page-login">
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '0.9em' }}>
          Don't have an account? <Link to="/register" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;