import React, { useState } from 'react';
import API from '../services/api';
import Alert from '../components/Alert';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const usuariosPrueba = [
    { nombre: 'Juan Pérez', email: 'juan@universidad.edu', rol: 'ESTUDIANTE', icon: '👨‍🎓' },
    { nombre: 'Roberto López', email: 'roberto@universidad.edu', rol: 'JEFE_AREA', icon: '👨‍💼' },
    { nombre: 'Admin Sistema', email: 'admin@universidad.edu', rol: 'ADMIN', icon: '⚙️' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    await handleLogin(email);
  };

  const handleQuickLogin = async (emailPrueba) => {
    setEmail(emailPrueba);
    setTimeout(() => handleLogin(emailPrueba), 100);
  };

  const handleLogin = async (emailToUse) => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.login(emailToUse);
      if (response && response.token) {
        API.setToken(response.token);
        onLogin(response.usuario, response.token);
      } else {
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión. Verifique que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{ background: `url(${process.env.PUBLIC_URL}/images/fondounmsm.jpg) center/cover no-repeat fixed` }}
    >
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo-circle">
            <img
              src="/images/logounmsm.png"
              alt="UNMSM Logo"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/logo-unmsm.svg'; }}
            />
          </div>
          <h1>Campus 360</h1>
          <p className="login-subtitle">Sistema de Reserva de Ambientes UNMSM</p>
        </div>

        {/* Login Form Card */}
        <div className="login-card">
          {error && (
            <Alert 
              type="error" 
              mensaje={error} 
              onClose={() => setError(null)} 
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo universitario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Conectando...' : 'Inicia Sesión'}
            </button>
          </form>

          <div className="login-divider">
            <span>O accede rápidamente</span>
          </div>

          {/* Quick Login Buttons */}
          <div className="test-accounts">
            {usuariosPrueba.map((usuario) => (
              <button
                key={usuario.email}
                type="button"
                className="test-account-btn"
                onClick={() => handleQuickLogin(usuario.email)}
                disabled={loading}
              >
                <span className="account-icon">{usuario.icon}</span>
                <span className="account-name">{usuario.nombre}</span>
                <span className="account-email">{usuario.rol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="login-info">
          <h3>📌 Información de Acceso</h3>
          <ul>
            <li>No requiere contraseña (modo demostración)</li>
            <li>Base de datos en memoria</li>
            <li>Usa uno de los botones rápidos para acceder</li>
            <li>Roles: Estudiante • Jefe de Área • Admin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
