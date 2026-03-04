import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import FormGroup from '../../components/FormGroup';
import Modal from '../../components/Modal';
import './BuscarAmbientes.css';

function BuscarAmbientes({ usuario, token, onNotificacionesActualizar }) {
  const [ambientes, setAmbientes] = useState([]);
  const HORA_INICIO_DISPONIBLE = 8;  // 8 AM
  const HORA_FIN_DISPONIBLE = 22;   // 10 PM
  const [filtros, setFiltros] = useState({
    tipo: '',
    capacidadMinima: '',
    fechaInicio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [modalReserva, setModalReserva] = useState(false);
  const [datosReserva, setDatosReserva] = useState({
    motivo: '',
  });
  const [modalFecha, setModalFecha] = useState('');
  const [modalHoraInicio, setModalHoraInicio] = useState('08:00');
  const [modalHoraFin, setModalHoraFin] = useState('10:00');

  useEffect(() => {
    cargarAmbientes();
  }, [filtros]);

  const cargarAmbientes = async () => {
    setLoading(true);
    try {
      const filtrosEnviar = {};
      if (filtros.tipo) filtrosEnviar.tipo = filtros.tipo;
      if (filtros.capacidadMinima) filtrosEnviar.capacidadMinima = filtros.capacidadMinima;
      if (filtros.fechaInicio) filtrosEnviar.fechaInicio = filtros.fechaInicio;

      const datos = await API.getAmbientes(filtrosEnviar);
      setAmbientes(datos);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAbrirReserva = (ambiente) => {
    setSelectedAmbiente(ambiente);
    setDatosReserva({ motivo: '' });
    setModalFecha(filtros.fechaInicio || '');
    setModalHoraInicio('08:00');
    setModalHoraFin('10:00');
    setModalReserva(true);
  };

  const handleCrearReserva = async () => {
    const fechaSeleccion = modalFecha || filtros.fechaInicio;

    if (!datosReserva.motivo || !fechaSeleccion || !modalHoraInicio || !modalHoraFin) {
      setError('Por favor completa todos los campos (motivo, fecha, hora inicio y hora fin)');
      return;
    }

    // validar que hora inicio sea menor que hora fin
    const [horaIni, minIni] = modalHoraInicio.split(':').map(Number);
    const [horaFin, minFin] = modalHoraFin.split(':').map(Number);
    const tiempoIni = horaIni * 60 + minIni;
    const tiempoFin = horaFin * 60 + minFin;

    if (tiempoIni >= tiempoFin) {
      setError('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    // validar que esté dentro del rango disponible (8 AM - 10 PM)
    if (horaIni < HORA_INICIO_DISPONIBLE || horaFin > HORA_FIN_DISPONIBLE) {
      setError(`El horario disponible es de ${HORA_INICIO_DISPONIBLE}:00 a ${HORA_FIN_DISPONIBLE}:00`);
      return;
    }

    try {
      await API.crearReserva({
        ambienteId: selectedAmbiente.id,
        fechaInicio: new Date(`${fechaSeleccion}T${modalHoraInicio}`).toISOString(),
        fechaFin: new Date(`${fechaSeleccion}T${modalHoraFin}`).toISOString(),
        motivo: datosReserva.motivo,
      });

      // marcar todas las notificaciones como leídas
      try {
        await API.marcarTodasComoLeidas(usuario.id);
        if (onNotificacionesActualizar) onNotificacionesActualizar();
      } catch (e) {
        console.warn('No se pudo limpiar notificaciones:', e.message);
      }

      setSuccess('Reserva creada exitosamente. Está pendiente de aprobación.');
      setModalReserva(false);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content-section">
      <h2 className="section-title">🔍 Buscar Ambientes Disponibles</h2>

      {error && <Alert type="error" mensaje={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" titulo="Éxito" mensaje={success} onClose={() => setSuccess(null)} />}

      <Card title="Filtros de Búsqueda" className="filters-card">
        <div className="filters-grid">
          <FormGroup
            label="Fecha"
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleFiltroChange}
          />
          <FormGroup
            label="Tipo de Ambiente"
            type="text"
            name="tipo"
            value={filtros.tipo}
            onChange={handleFiltroChange}
            placeholder="ej: LABORATORIO, SALON, AUDITORIO"
          />
          <FormGroup
            label="Capacidad Mínima"
            type="number"
            name="capacidadMinima"
            value={filtros.capacidadMinima}
            onChange={handleFiltroChange}
            placeholder="ej: 30"
          />
        </div>
      </Card>

      <h3 className="results-title">Resultados ({ambientes.length})</h3>

      {loading && <div className="loading">Cargando ambientes...</div>}

      <div className="ambientes-grid">
        {ambientes.map(ambiente => (
          <Card key={ambiente.id} className="ambiente-card">
            <div className="ambiente-header">
              <h3>{ambiente.nombre}</h3>
              <span className={`estado-badge estado-${ambiente.estado.toLowerCase()}`}>
                {ambiente.estado}
              </span>
            </div>

            <div className="ambiente-info">
              <div className="info-row">
                <span className="label">Ubicación:</span>
                <span>{ambiente.ubicacion}</span>
              </div>
              <div className="info-row">
                <span className="label">Tipo:</span>
                <span>{ambiente.tipo}</span>
              </div>
              <div className="info-row">
                <span className="label">Capacidad:</span>
                <span>{ambiente.capacidad} personas</span>
              </div>
              {ambiente.recursos.length > 0 && (
                <div className="info-row">
                  <span className="label">Recursos:</span>
                  <div className="recursos">
                    {ambiente.recursos.map((recurso, idx) => (
                      <span key={idx} className="recurso-badge">{recurso}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="small"
              onClick={() => handleAbrirReserva(ambiente)}
              disabled={ambiente.estado !== 'DISPONIBLE'}
            >
              Reservar
            </Button>
          </Card>
        ))}
      </div>

      {ambientes.length === 0 && !loading && (
        <Card className="empty-state">
          <div className="empty-content">
            <span className="empty-icon">📭</span>
            <h3>No hay ambientes disponibles</h3>
            <p>Intenta cambiar los filtros de búsqueda</p>
          </div>
        </Card>
      )}

      <Modal
        isOpen={modalReserva}
        title="Crear Reserva"
        onClose={() => setModalReserva(false)}
        onConfirm={handleCrearReserva}
        confirmText="Reservar"
        cancelText="Cancelar"
      >
        {selectedAmbiente && (
          <div className="modal-content">
            <div className="ambiente-preview">
              <h4>{selectedAmbiente.nombre}</h4>
              <p>{selectedAmbiente.ubicacion}</p>
            </div>

            <FormGroup
              label="Motivo de la Reserva"
              type="textarea"
              name="motivo"
              value={datosReserva.motivo}
              onChange={(e) => setDatosReserva({ motivo: e.target.value })}
              placeholder="ej: Clase de laboratorio, Taller, Seminario, etc."
              required
            />

            <FormGroup
              label="Fecha"
              type="date"
              name="modalFecha"
              value={modalFecha}
              onChange={(e) => setModalFecha(e.target.value)}
            />

            <div className="time-inputs">
              <FormGroup
                label="Hora de Inicio"
                type="time"
                name="modalHoraInicio"
                value={modalHoraInicio}
                onChange={(e) => setModalHoraInicio(e.target.value)}
              />
              <FormGroup
                label="Hora de Fin"
                type="time"
                name="modalHoraFin"
                value={modalHoraFin}
                onChange={(e) => setModalHoraFin(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default BuscarAmbientes;
