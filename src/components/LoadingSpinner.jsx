/**
 * Componente de loading spinner reutilizável
 * Fornece feedback visual durante operações assíncronas
 */
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#8B5FBF', 
  text = 'A carregar...',
  className = '' 
}) => {
  return (
    <div className={`loading-spinner ${size} ${className}`} role="status" aria-live="polite">
      <div 
        className="spinner" 
        style={{ borderTopColor: color }}
        aria-hidden="true"
      ></div>
      {text && (
        <span className="loading-text" aria-label={text}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
