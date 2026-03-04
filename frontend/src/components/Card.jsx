import React from 'react';
import './Card.css';

function Card({ title, children, className = '', icon = null }) {
  return (
    <div className={`card ${className}`}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          {title && <h2 className="card-title">{title}</h2>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default Card;
