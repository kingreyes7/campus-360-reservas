import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import BuscarAmbientes from './estudiante/BuscarAmbientes';
import MisReservas from './estudiante/MisReservas';
import './DashboardLayout.css';

function EstudianteDashboard({ usuario, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('buscar');
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);

  useEffect(() => {
    cargarNotificacionesNoLeidas();
    const interval = setInterval(cargarNotificacionesNoLeidas, 5000); // Actualizar cada 5s
    return () => clearInterval(interval);
  }, []);

  const cargarNotificacionesNoLeidas = async () => {
    try {
      const notificaciones = await API.getNotificacionesNoLeidas(usuario.id);
      setNotificacionesNoLeidas(notificaciones.length);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  return (
    <div className="dashboard">
      <Navbar usuario={usuario} onLogout={onLogout} />

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'buscar' ? 'active' : ''}`}
              onClick={() => setActiveTab('buscar')}
            >
              🔍 Buscar Ambientes
            </button>
            <button
              className={`menu-item ${activeTab === 'reservas' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservas')}
            >
              📋 Mis Reservas
              {notificacionesNoLeidas > 0 && (
                <span className="badge">{notificacionesNoLeidas}</span>
              )}
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === 'buscar' && (
            <BuscarAmbientes
              usuario={usuario}
              token={token}
              onNotificacionesActualizar={cargarNotificacionesNoLeidas}
            />
          )}
          {activeTab === 'reservas' && (
            <MisReservas usuario={usuario} token={token} onNotificacionesActualizar={cargarNotificacionesNoLeidas} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EstudianteDashboard;
