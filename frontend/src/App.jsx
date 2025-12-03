import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './pages/Navbar';
import LandingPage from './pages/LandingPage';
import NoteEditor from './pages/NoteEditor';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
      <BrowserRouter>
        {/* Navbar appears on all pages */}
        <Navbar />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<NoteEditor />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
        </Routes>
      </BrowserRouter>
  );
}

export default App;