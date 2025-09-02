

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Biblioteca from './pages/Biblioteca';
import LiberdadeAlimentar from './pages/LiberdadeAlimentar';
import VideoPlayer from './pages/VideoPlayer';
import './App.css';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login e registro ainda funcionam, mas agora só acessa se quiser */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard acessível SEM login */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/curso/:courseId" element={<LiberdadeAlimentar />} />
          <Route path="/curso/:courseId/player" element={<VideoPlayer />} />

          {/* Redireciona / para dashboard SEM exigir login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
