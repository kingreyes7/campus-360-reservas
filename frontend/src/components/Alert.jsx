import React from 'react';
import './Alert.css';

function Alert({ type = 'info', titulo, mensaje, onClose = null }) {
  const iconos = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ'
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{iconos[type]}</span>
        <div className="alert-body">
          {titulo && <h4 className="alert-title">{titulo}</h4>}
          {mensaje && <p className="alert-message">{mensaje}</p>}
        </div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>✕</button>
      )}
    </div>
  );
}

export default Alert;
