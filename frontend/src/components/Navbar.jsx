import React from 'react';
import './Navbar.css';

function Navbar({ usuario, onLogout }) {
  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar sesión?')) {
      onLogout();
    }
  };

  const getRoleIcon = (rol) => {
    switch (rol) {
      case 'ESTUDIANTE':
        return '👨‍🎓';
      case 'JEFE_AREA':
        return '👨‍💼';
      case 'ADMIN':
        return '⚙️';
      default:
        return '👤';
    }
  };

  const getRoleLabel = (rol) => {
    switch (rol) {
      case 'ESTUDIANTE':
        return 'Estudiante';
      case 'JEFE_AREA':
        return 'Jefe de Área';
      case 'ADMIN':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
            <div className="navbar-brand-icon">
            <img
              src="/images/logounmsm.png"
              alt="Logo"
              style={{ width: '28px', height: '28px' }}
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/logo-unmsm.svg'; }}
            />
          </div>
          <div className="navbar-brand-text">
            <h1>Campus 360</h1>
            <p className="navbar-subtitle">UNMSM</p>
          </div>
        </div>

        <div className="navbar-menu">
          <div className="user-info">
            <span className="user-role">
              {getRoleIcon(usuario.rol)} {getRoleLabel(usuario.rol)}
            </span>
            <span className="user-name">{usuario.nombre}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
