import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EstudianteDashboard from './pages/EstudianteDashboard';
import JefeAreaDashboard from './pages/JefeAreaDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Restaurar sesión desde localStorage
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  const handleLogin = (usuarioData, tokenData) => {
    setUsuario(usuarioData);
    setToken(tokenData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  };

  const handleLogout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!usuario ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
        />

        {usuario ? (
          <>
            {usuario.rol === 'ESTUDIANTE' && (
              <Route path="/*" element={<EstudianteDashboard usuario={usuario} token={token} onLogout={handleLogout} />} />
            )}
            {usuario.rol === 'JEFE_AREA' && (
              <Route path="/*" element={<JefeAreaDashboard usuario={usuario} token={token} onLogout={handleLogout} />} />
            )}
            {usuario.rol === 'ADMIN' && (
              <Route path="/*" element={<AdminDashboard usuario={usuario} token={token} onLogout={handleLogout} />} />
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
