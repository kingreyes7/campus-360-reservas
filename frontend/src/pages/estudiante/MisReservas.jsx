import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import './MisReservas.css';

function MisReservas({ usuario, token, onNotificacionesActualizar }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [ambientesMap, setAmbientesMap] = useState({});

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const datos = await API.getReservas();
      setReservas(datos);
      
      // Cargar detalles de ambientes
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

  const handleCancelar = async (reservaId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva? (Mínimo 24h antes)')) {
      return;
    }

    try {
      await API.cancelarReserva(reservaId);
      setSuccess('Reserva cancelada exitosamente');
      cargarReservas();
      onNotificacionesActualizar();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerDetalles = (reserva) => {
    setReservaSeleccionada(reserva);
    setModalDetalles(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'estado-confirmada';
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'RECHAZADA':
        return 'estado-rechazada';
      case 'CANCELADA':
        return 'estado-cancelada';
      default:
        return '';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return '✓';
      case 'PENDIENTE':
        return '⏳';
      case 'RECHAZADA':
        return '✕';
      case 'CANCELADA':
        return '✗';
      default:
        return '•';
    }
  };

  const puedeCancelar = (reserva) => {
    if (reserva.estado !== 'CONFIRMADA' && reserva.estado !== 'PENDIENTE') {
      return false;
    }
    const ahora = new Date();
    const horasRestantes = (new Date(reserva.fechaInicio) - ahora) / (1000 * 60 * 60);
    return horasRestantes >= 24;
  };

  return (
    <div className="content-section">
      <h2 className="section-title">📋 Mis Reservas</h2>

      {error && <Alert type="error" mensaje={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" titulo="Éxito" mensaje={success} onClose={() => setSuccess(null)} />}

      {loading && <div className="loading">Cargando reservas...</div>}

      {!loading && reservas.length === 0 && (
        <Card className="empty-state">
          <div className="empty-content">
            <span className="empty-icon">📭</span>
            <h3>No tienes reservas</h3>
            <p>Dirígete a "Buscar Ambientes" para crear una nueva reserva</p>
          </div>
        </Card>
      )}

      {!loading && reservas.length > 0 && (
        <div className="reservas-list">
          {reservas.map(reserva => {
            const ambiente = ambientesMap[reserva.ambienteId];
            return (
              <Card key={reserva.id} className={`reserva-card ${getEstadoColor(reserva.estado)}`}>
                <div className="reserva-header">
                  <div className="reserva-titulo">
                    <h3>{ambiente?.nombre || 'Ambiente desconocido'}</h3>
                    <span className={`estado-badge ${getEstadoColor(reserva.estado)}`}>
                      {getEstadoIcon(reserva.estado)} {reserva.estado}
                    </span>
                  </div>
                  <span className="reserva-id">ID: {reserva.id.substring(0, 8)}</span>
                </div>

                <div className="reserva-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">📍 Ubicación:</span>
                      <span>{ambiente?.ubicacion || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">📅 Fecha:</span>
                      <span>{new Date(reserva.fechaInicio).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">⏰ Horario:</span>
                      <span>
                        {new Date(reserva.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(reserva.fechaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">💬 Motivo:</span>
                      <span>{reserva.motivo}</span>
                    </div>
                  </div>

                  {reserva.estado === 'RECHAZADA' && reserva.motivoRechazo && (
                    <Alert type="error" titulo="Motivo del rechazo:" mensaje={reserva.motivoRechazo} />
                  )}
                </div>

                <div className="reserva-actions">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleVerDetalles(reserva)}
                  >
                    Ver Detalles
                  </Button>
                  {puedeCancelar(reserva) && (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleCancelar(reserva.id)}
                    >
                      Cancelar Reserva
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={modalDetalles}
        title="Detalles de la Reserva"
        onClose={() => setModalDetalles(false)}
      >
        {reservaSeleccionada && (
          <div className="detalles-modal">
            <div className="detalle-item">
              <strong>ID de Reserva:</strong>
              <span>{reservaSeleccionada.id}</span>
            </div>
            <div className="detalle-item">
              <strong>Estado:</strong>
              <span className={`badge ${getEstadoColor(reservaSeleccionada.estado)}`}>
                {reservaSeleccionada.estado}
              </span>
            </div>
            <div className="detalle-item">
              <strong>Ambiente:</strong>
              <span>{ambientesMap[reservaSeleccionada.ambienteId]?.nombre}</span>
            </div>
            <div className="detalle-item">
              <strong>Fecha Creación:</strong>
              <span>{new Date(reservaSeleccionada.fechaCreacion).toLocaleString()}</span>
            </div>
            {reservaSeleccionada.fechaConfirmacion && (
              <div className="detalle-item">
                <strong>Fecha Confirmación:</strong>
                <span>{new Date(reservaSeleccionada.fechaConfirmacion).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MisReservas;
