import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import NoteEditor from './pages/NoteEditor';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / URL shows landing page */}
        <Route path="/" element={<LandingPage />} />
        {/* /app URL shows note editor*/}
        <Route path="/app" element={<NoteEditor />} /> 
        {/* /login shows login screen */}
        <Route path="/login" element={<Login />} />
        {/* /register shows registration screen */}
        <Route path="/register" element={<Register />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;