import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import FormGroup from '../components/FormGroup';
import './DashboardLayout.css';

function AdminDashboard({ usuario, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('ambientes');
  const [ambientes, setAmbientes] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal para crear/editar ambiente
  const [modalAmbiente, setModalAmbiente] = useState(false);
  const [ambienteForm, setAmbienteForm] = useState({
    nombre: '',
    ubicacion: '',
    tipo: 'SALON',
    capacidad: '',
    recursos: ''
  });

  // Modal para bloqueo
  const [modalBloqueo, setModalBloqueo] = useState(false);
  const [bloqueoForm, setBloqueoForm] = useState({
    ambienteId: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (activeTab === 'ambientes') {
        const datos = await API.getAmbientes();
        setAmbientes(datos);
      } else if (activeTab === 'bloqueos') {
        const datos = await API.getBloqueos();
        setBloqueos(datos);
        const ambs = await API.getAmbientes();
        setAmbientes(ambs);
      } else if (activeTab === 'usuarios') {
        const datos = await API.getUsuarios();
        setUsuarios(datos);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearAmbiente = async () => {
    if (!ambienteForm.nombre || !ambienteForm.ubicacion || !ambienteForm.capacidad) {
      setError('Completa todos los campos requeridos');
      return;
    }

    try {
      const nuevoAmbiente = {
        id: 'amb-' + Date.now(),
        nombre: ambienteForm.nombre,
        ubicacion: ambienteForm.ubicacion,
        tipo: ambienteForm.tipo,
        capacidad: parseInt(ambienteForm.capacidad),
        recursos: ambienteForm.recursos ? ambienteForm.recursos.split(',').map(r => r.trim()) : []
      };

      await API.crearAmbiente(nuevoAmbiente);
      setSuccess('Ambiente creado exitosamente');
      setModalAmbiente(false);
      setAmbienteForm({
        nombre: '',
        ubicacion: '',
        tipo: 'SALON',
        capacidad: '',
        recursos: ''
      });
      cargarDatos();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminarAmbiente = async (id) => {
    if (!window.confirm('¿Estás seguro? Este ambiente debe estar sin reservas activas')) {
      return;
    }

    try {
      await API.eliminarAmbiente(id);
      setSuccess('Ambiente eliminado');
      cargarDatos();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCrearBloqueo = async () => {
    if (!bloqueoForm.ambienteId || !bloqueoForm.fechaInicio || !bloqueoForm.fechaFin || !bloqueoForm.descripcion) {
      setError('Completa todos los campos');
      return;
    }

    try {
      await API.crearBloqueo({
        ambienteId: bloqueoForm.ambienteId,
        fechaInicio: new Date(bloqueoForm.fechaInicio).toISOString(),
        fechaFin: new Date(bloqueoForm.fechaFin).toISOString(),
        descripcion: bloqueoForm.descripcion
      });

      setSuccess('Bloqueo creado exitosamente');
      setModalBloqueo(false);
      setBloqueoForm({
        ambienteId: '',
        fechaInicio: '',
        fechaFin: '',
        descripcion: ''
      });
      cargarDatos();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard">
      <Navbar usuario={usuario} onLogout={onLogout} />

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'ambientes' ? 'active' : ''}`}
              onClick={() => setActiveTab('ambientes')}
            >
              🏛️ Ambientes ({ambientes.length})
            </button>
            <button
              className={`menu-item ${activeTab === 'bloqueos' ? 'active' : ''}`}
              onClick={() => setActiveTab('bloqueos')}
            >
              🔒 Bloqueos ({bloqueos.length})
            </button>
            <button
              className={`menu-item ${activeTab === 'usuarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('usuarios')}
            >
              👥 Usuarios ({usuarios.length})
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="content-section">
            {activeTab === 'ambientes' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 className="section-title">🏛️ Gestión de Ambientes</h2>
                  <Button variant="primary" onClick={() => setModalAmbiente(true)}>
                    ➕ Crear Ambiente
                  </Button>
                </div>

                {error && <Alert type="error" mensaje={error} onClose={() => setError(null)} />}
                {success && <Alert type="success" titulo="Éxito" mensaje={success} onClose={() => setSuccess(null)} />}

                {loading && <div className="loading">Cargando ambientes...</div>}

                {!loading && ambientes.length === 0 ? (
                  <Card className="empty-state">
                    <div className="empty-content">
                      <span className="empty-icon">🏭</span>
                      <h3>No hay ambientes</h3>
                    </div>
                  </Card>
                ) : (
                  <div className="ambientes-table">
                    {ambientes.map(ambiente => (
                      <Card key={ambiente.id} className="ambiente-row">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>{ambiente.nombre}</h4>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                              📍 {ambiente.ubicacion} | 🎓 {ambiente.tipo} | 👥 Cap: {ambiente.capacidad}
                            </p>
                          </div>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleEliminarAmbiente(ambiente.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'bloqueos' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 className="section-title">🔒 Bloqueos de Mantenimiento</h2>
                  <Button variant="primary" onClick={() => setModalBloqueo(true)}>
                    ➕ Crear Bloqueo
                  </Button>
                </div>

                {error && <Alert type="error" mensaje={error} onClose={() => setError(null)} />}
                {success && <Alert type="success" titulo="Éxito" mensaje={success} onClose={() => setSuccess(null)} />}

                {loading && <div className="loading">Cargando bloqueos...</div>}

                {!loading && bloqueos.length === 0 ? (
                  <Card className="empty-state">
                    <div className="empty-content">
                      <span className="empty-icon">✓</span>
                      <h3>No hay bloqueos activos</h3>
                    </div>
                  </Card>
                ) : (
                  <div className="bloqueos-table">
                    {bloqueos.map(bloqueo => (
                      <Card key={bloqueo.id} className="bloqueo-row">
                        <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>
                          {ambientes.find(a => a.id === bloqueo.ambienteId)?.nombre || 'Ambiente desconocido'}
                        </h4>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          📅 {new Date(bloqueo.fechaInicio).toLocaleDateString()} - {new Date(bloqueo.fechaFin).toLocaleDateString()}
                        </p>
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                          💬 {bloqueo.descripcion}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'usuarios' && (
              <>
                <h2 className="section-title">👥 Gestión de Usuarios</h2>

                {loading && <div className="loading">Cargando usuarios...</div>}

                {!loading && usuarios.length === 0 ? (
                  <Card className="empty-state">
                    <div className="empty-content">
                      <span className="empty-icon">👥</span>
                      <h3>No hay usuarios</h3>
                    </div>
                  </Card>
                ) : (
                  <div className="usuarios-table">
                    {usuarios.map(user => (
                      <Card key={user.id} className="usuario-row">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem', color: '#333' }}>{user.nombre}</h4>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                              {user.email} | {user.rol}
                            </p>
                          </div>
                          <span className={`estado-badge estado-${user.activo ? 'activo' : 'inactivo'}`}>
                            {user.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalAmbiente}
        title="Crear Nuevo Ambiente"
        onClose={() => setModalAmbiente(false)}
        onConfirm={handleCrearAmbiente}
        confirmText="Crear"
      >
        <FormGroup
          label="Nombre"
          name="nombre"
          value={ambienteForm.nombre}
          onChange={(e) => setAmbienteForm({ ...ambienteForm, nombre: e.target.value })}
          required
        />
        <FormGroup
          label="Ubicación"
          name="ubicacion"
          value={ambienteForm.ubicacion}
          onChange={(e) => setAmbienteForm({ ...ambienteForm, ubicacion: e.target.value })}
          required
        />
        <FormGroup
          label="Tipo"
          name="tipo"
          value={ambienteForm.tipo}
          onChange={(e) => setAmbienteForm({ ...ambienteForm, tipo: e.target.value })}
        >
          <select value={ambienteForm.tipo} onChange={(e) => setAmbienteForm({ ...ambienteForm, tipo: e.target.value })}>
            <option>SALON</option>
            <option>LABORATORIO</option>
            <option>AUDITORIO</option>
            <option>SALA_REUNIONES</option>
          </select>
        </FormGroup>
        <FormGroup
          label="Capacidad"
          type="number"
          name="capacidad"
          value={ambienteForm.capacidad}
          onChange={(e) => setAmbienteForm({ ...ambienteForm, capacidad: e.target.value })}
          required
        />
        <FormGroup
          label="Recursos (separados por comas)"
          name="recursos"
          value={ambienteForm.recursos}
          onChange={(e) => setAmbienteForm({ ...ambienteForm, recursos: e.target.value })}
          placeholder="ej: Proyector, Aire acondicionado, Pizarra"
        />
      </Modal>

      <Modal
        isOpen={modalBloqueo}
        title="Crear Bloqueo de Mantenimiento"
        onClose={() => setModalBloqueo(false)}
        onConfirm={handleCrearBloqueo}
        confirmText="Crear Bloqueo"
      >
        <FormGroup
          label="Ambiente"
          name="ambienteId"
          value={bloqueoForm.ambienteId}
          onChange={(e) => setBloqueoForm({ ...bloqueoForm, ambienteId: e.target.value })}
          required
        >
          <select value={bloqueoForm.ambienteId} onChange={(e) => setBloqueoForm({ ...bloqueoForm, ambienteId: e.target.value })}>
            <option value="">Selecciona un ambiente</option>
            {ambientes.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </FormGroup>
        <FormGroup
          label="Fecha de Inicio"
          type="date"
          name="fechaInicio"
          value={bloqueoForm.fechaInicio}
          onChange={(e) => setBloqueoForm({ ...bloqueoForm, fechaInicio: e.target.value })}
          required
        />
        <FormGroup
          label="Fecha de Fin"
          type="date"
          name="fechaFin"
          value={bloqueoForm.fechaFin}
          onChange={(e) => setBloqueoForm({ ...bloqueoForm, fechaFin: e.target.value })}
          required
        />
        <FormGroup
          label="Descripción"
          type="textarea"
          name="descripcion"
          value={bloqueoForm.descripcion}
          onChange={(e) => setBloqueoForm({ ...bloqueoForm, descripcion: e.target.value })}
          placeholder="ej: Pintura, Reparación eléctrica, etc."
          required
        />
      </Modal>
    </div>
  );
}

export default AdminDashboard;
