import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Biblioteca.css';

export default function Biblioteca() {
  const [activeTab, setActiveTab] = useState('biblioteca');
  const navigate = useNavigate();

  const libraryItems = [
    {
      id: 1,
      title: 'Liberdade Alimentar',
      description: 'Curso sobre liberdade alimentar e bem-estar'
    },
    {
      id: 2,
      title: 'Olimpo',
      description: 'Corpo e mente invencíveis.'
    },
    {
      id: 3,
      title: 'Joanaflix',
      description: 'Desvenda o poder da nutrição com aulas didáticas.'
    },
    {
      id: 4,
      title: 'Workshops',
      description: 'Lorem Ipsum is simply d text Lorem Ipsum is simply d text'
    },
    {
      id: 5,
      title: 'Masterclasses',
      description: 'Lorem Ipsum is simply d text Lorem Ipsum is simply d text'
    },
    {
      id: 6,
      title: 'Desafio Corpo & Mente Sã',
      description: 'Lorem Ipsum is simply d text Lorem Ipsum is simply d text'
    }
  ];

  const handleNavigation = (tab) => {
    if (tab === 'home') {
      navigate('/dashboard');
    }
  };

  const handleItemClick = (item) => {
    if (item.title === 'Liberdade Alimentar') {
      navigate('/curso/1');
    }
  };

  return (
    <div className="biblioteca">
      {/* Header */}
      <div className="biblioteca-header">
        <h1>Biblioteca</h1>
      </div>

      {/* Content Area */}
      <div className="biblioteca-content">
        {libraryItems.map((item) => (
          <div 
            key={item.id} 
            className="library-item"
            onClick={() => handleItemClick(item)}
            style={{ cursor: item.title === 'Liberdade Alimentar' ? 'pointer' : 'default' }}
          >
            <div className="item-thumbnail">
              {item.title.charAt(0)}
            </div>
            
            <div className="item-content">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => handleNavigation('home')}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-utensils"></i>
          <span>Plano</span>
        </div>
        <div className="nav-item add-btn">
          <i className="fas fa-plus"></i>
        </div>
        <div className="nav-item active">
          <i className="fas fa-play"></i>
          <span>Biblioteca</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-user"></i>
          <span>Perfil</span>
        </div>
      </div>
    </div>
  );
}
