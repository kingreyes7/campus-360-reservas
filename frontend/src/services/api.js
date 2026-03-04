/**
 * Servicio de API
 * Comunica con el backend
 */

const API_URL = 'http://localhost:5000';

class APIService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error en la solicitud');
      }

      return data.datos || data;
    } catch (error) {
      throw error;
    }
  }

  // ============ AUTH ============
  async login(email) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'demo' }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // ============ AMBIENTES ============
  async getAmbientes(filtros = {}) {
    const params = new URLSearchParams(filtros);
    return this.request(`/ambientes?${params}`);
  }

  async getAmbiente(id) {
    return this.request(`/ambientes/${id}`);
  }

  async crearAmbiente(ambiente) {
    return this.request('/ambientes', {
      method: 'POST',
      body: JSON.stringify(ambiente),
    });
  }

  async actualizarAmbiente(id, ambiente) {
    return this.request(`/ambientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ambiente),
    });
  }

  async eliminarAmbiente(id) {
    return this.request(`/ambientes/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ RESERVAS ============
  async getReservas(filtros = {}) {
    const params = new URLSearchParams(filtros);
    return this.request(`/reservas?${params}`);
  }

  async getReserva(id) {
    return this.request(`/reservas/${id}`);
  }

  async crearReserva(reserva) {
    return this.request('/reservas', {
      method: 'POST',
      body: JSON.stringify(reserva),
    });
  }

  async confirmarReserva(id) {
    return this.request(`/reservas/${id}/confirmar`, {
      method: 'PUT',
    });
  }

  async rechazarReserva(id, motivo) {
    return this.request(`/reservas/${id}/rechazar`, {
      method: 'PUT',
      body: JSON.stringify({ motivo }),
    });
  }

  async cancelarReserva(id) {
    return this.request(`/reservas/${id}/cancelar`, {
      method: 'PUT',
    });
  }

  // ============ BLOQUEOS ============
  async getBloqueos() {
    return this.request('/bloqueos');
  }

  async getBloqueosPorAmbiente(ambienteId) {
    return this.request(`/bloqueos/ambiente/${ambienteId}`);
  }

  async crearBloqueo(bloqueo) {
    return this.request('/bloqueos', {
      method: 'POST',
      body: JSON.stringify(bloqueo),
    });
  }

  async eliminarBloqueo(id) {
    return this.request(`/bloqueos/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ USUARIOS ============
  async getUsuarios() {
    return this.request('/usuarios');
  }

  async getUsuario(id) {
    return this.request(`/usuarios/${id}`);
  }

  async getNotificaciones(usuarioId) {
    return this.request(`/usuarios/${usuarioId}/notificaciones`);
  }

  async getNotificacionesNoLeidas(usuarioId) {
    return this.request(`/usuarios/${usuarioId}/notificaciones/no-leidas`);
  }

  async marcarNotificacionComoLeida(usuarioId, notificacionId) {
    return this.request(`/usuarios/${usuarioId}/notificaciones/${notificacionId}/leer`, {
      method: 'PUT',
    });
  }

  async marcarTodasComoLeidas(usuarioId) {
    return this.request(`/usuarios/${usuarioId}/notificaciones/todas/leer`, {
      method: 'PUT',
    });
  }
}

export default new APIService();
