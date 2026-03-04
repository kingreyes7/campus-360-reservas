import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import FormGroup from '../components/FormGroup';
import './DashboardLayout.css';

function JefeAreaDashboard({ usuario, token, onLogout }) {
  const [reservasPendientes, setReservasPendientes] = useState([]);
  const [todasLasReservas, setTodasLasReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('pendientes');
  const [modalRechazar, setModalRechazar] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [ambientesMap, setAmbientesMap] = useState({});

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const pendientes = await API.getReservas({ estado: 'PENDIENTE' });
      const todas = await API.getReservas();
      
      setReservasPendientes(pendientes);
      setTodasLasReservas(todas);

      const ambientes = await API.getAmbientes();
      const mapAmbientes = {};
      ambientes.forEach(a => {
        mapAmbientes[a.id] = a;
      });
      setAmbientesMap(mapAmbientes);

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (reservaId) => {
    try {
      await API.confirmarReserva(reservaId);
      setSuccess('Reserva confirmada exitosamente');
      cargarReservas();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAbrirRechazar = (reserva) => {
    setReservaSeleccionada(reserva);
    setMotivoRechazo('');
    setModalRechazar(true);
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      setError('Debes ingresar un motivo de rechazo');
      return;
    }

    try {
      await API.rechazarReserva(reservaSeleccionada.id, motivoRechazo);
      setSuccess('Reserva rechazada');
      setModalRechazar(false);
      cargarReservas();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const ReservaRow = ({ reserva }) => (
    <Card className="reserva-list-item" key={reserva.id}>
      <div className="item-header">
        <h4>{ambientesMap[reserva.ambienteId]?.nombre || 'Ambiente desconocido'}</h4>
        <span className={`estado-badge estado-${reserva.estado.toLowerCase()}`}>
          {reserva.estado}
        </span>
      </div>

      <div className="item-body">
        <div className="item-info">
          <span><strong>Estudiante:</strong> {reserva.usuarioId}</span>
          <span><strong>Fecha:</strong> {new Date(reserva.fechaInicio).toLocaleDateString()}</span>
          <span><strong>Motivo:</strong> {reserva.motivo}</span>
        </div>

        {reserva.estado === 'PENDIENTE' && (
          <div className="item-actions">
            <Button
              variant="success"
              size="small"
              onClick={() => handleConfirmar(reserva.id)}
            >
              Confirmar
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => handleAbrirRechazar(reserva)}
            >
              Rechazar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="dashboard">
      <Navbar usuario={usuario} onLogout={onLogout} />

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'pendientes' ? 'active' : ''}`}
              onClick={() => setActiveTab('pendientes')}
            >
              ⏳ Pendientes
              <span className="badge">{reservasPendientes.length}</span>
            </button>
            <button
              className={`menu-item ${activeTab === 'todas' ? 'active' : ''}`}
              onClick={() => setActiveTab('todas')}
            >
              📋 Todas las Reservas
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-section">
            <h2 className="section-title">
              {activeTab === 'pendientes' ? '⏳ Reservas Pendientes' : '📋 Todas las Reservas'}
            </h2>

            {error && <Alert type="error" mensaje={error} onClose={() => setError(null)} />}
            {success && <Alert type="success" titulo="Éxito" mensaje={success} onClose={() => setSuccess(null)} />}

            {loading && <div className="loading">Cargando reservas...</div>}

            {!loading && (
              <>
                {activeTab === 'pendientes' && (
                  <>
                    {reservasPendientes.length === 0 ? (
                      <Card className="empty-state">
                        <div className="empty-content">
                          <span className="empty-icon">✓</span>
                          <h3>No hay reservas pendientes</h3>
                        </div>
                      </Card>
                    ) : (
                      <div className="reservas-list">
                        {reservasPendientes.map(r => (
                          <ReservaRow key={r.id} reserva={r} />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'todas' && (
                  <>
                    {todasLasReservas.length === 0 ? (
                      <Card className="empty-state">
                        <div className="empty-content">
                          <span className="empty-icon">📭</span>
                          <h3>No hay reservas</h3>
                        </div>
                      </Card>
                    ) : (
                      <div className="reservas-list">
                        {todasLasReservas.map(r => (
                          <ReservaRow key={r.id} reserva={r} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalRechazar}
        title="Rechazar Reserva"
        onClose={() => setModalRechazar(false)}
        onConfirm={handleRechazar}
        confirmText="Rechazar"
        cancelText="Cancelar"
      >
        <FormGroup
          label="Motivo del Rechazo"
          type="textarea"
          name="motivo"
          value={motivoRechazo}
          onChange={(e) => setMotivoRechazo(e.target.value)}
          placeholder="Explica por qué se rechaza esta reserva"
          required
        />
      </Modal>
    </div>
  );
}

export default JefeAreaDashboard;
