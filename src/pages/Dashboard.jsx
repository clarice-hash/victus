import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('Teste Victus');
  const [events, setEvents] = useState([
    { id: 1, date: '23/05', title: 'Masterclass' },
    { id: 2, date: '12/08', title: 'Workshop' },
    { id: 3, date: '+ 1', title: 'evento' }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // Buscar dados do utilizador do localStorage ou API
    const user = AuthService.getCurrentUser();
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === 'biblioteca') {
      navigate('/biblioteca');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Olá, {userName}!</h1>
        <div className="header-icons">
          <div className="icon-group">
            <i className="fas fa-users"></i>
          </div>
          <div className="icon-bell">
            <i className="fas fa-bell"></i>
          </div>
          <div className="icon-chat">
            <i className="fas fa-comment"></i>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="banner-content">
            <h2>Bem-vinda à minha App!</h2>
            <p>Clica aqui para iniciares a tua jornada</p>
            <button className="start-btn">Começa aqui</button>
          </div>
          <div className="banner-image">
            <div className="profile-photo"></div>
          </div>
        </div>

        {/* Daily Reminder */}
        <div className="reminder-card">
          <h3>LEMBRETE DO DIA:</h3>
          <p>"É importante agradecer pelo hoje, sem nunca desistir do amanhã!"</p>
        </div>

        {/* Progress and Events Section */}
        <div className="progress-events-section">
          {/* Progress Card */}
          <div className="progress-card">
            <div className="progress-circle">
              <div className="progress-fill"></div>
              <span className="progress-text">2kg perdidos</span>
            </div>
          </div>

          {/* Events Card */}
          <div className="events-card">
            <h3>Próximos eventos:</h3>
            <ul className="events-list">
              {events.map(event => (
                <li key={event.id}>
                  {event.date} | {event.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleNavigation('home')}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </div>
        <div className={`nav-item ${activeTab === 'plano' ? 'active' : ''}`} onClick={() => handleNavigation('plano')}>
          <i className="fas fa-utensils"></i>
          <span>Plano</span>
        </div>
        <div className="nav-item add-btn">
          <i className="fas fa-plus"></i>
        </div>
        <div className={`nav-item ${activeTab === 'biblioteca' ? 'active' : ''}`} onClick={() => handleNavigation('biblioteca')}>
          <i className="fas fa-play"></i>
          <span>Biblioteca</span>
        </div>
        <div className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => handleNavigation('perfil')}>
          <i className="fas fa-user"></i>
          <span>Perfil</span>
        </div>
      </div>
    </div>
  );
}
