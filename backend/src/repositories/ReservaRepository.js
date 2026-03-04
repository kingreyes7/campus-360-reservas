/**
 * ReservaRepository
 * Repositorio para gestionar reservas en memoria
 */

class ReservaRepository {
  constructor() {
    this.reservas = [];
  }

  crearReserva(reserva) {
    this.reservas.push(reserva);
    return reserva;
  }

  obtenerPorId(id) {
    return this.reservas.find(r => r.id === id) || null;
  }

  obtenerTodas() {
    return [...this.reservas];
  }

  obtenerPorUsuario(usuarioId) {
    return this.reservas.filter(r => r.usuarioId === usuarioId);
  }

  obtenerPorAmbiente(ambienteId) {
    return this.reservas.filter(r => r.ambienteId === ambienteId);
  }

  obtenerActivasPorUsuario(usuarioId) {
    return this.reservas.filter(r => 
      r.usuarioId === usuarioId && 
      (r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE')
    );
  }

  obtenerPendientes() {
    return this.reservas.filter(r => r.estado === 'PENDIENTE');
  }

  obtenerConfirmadas() {
    return this.reservas.filter(r => r.estado === 'CONFIRMADA');
  }

  obtenerPorEstado(estado) {
    return this.reservas.filter(r => r.estado === estado);
  }

  obtenerEnRango(ambienteId, fechaInicio, fechaFin) {
    return this.reservas.filter(r =>
      r.ambienteId === ambienteId &&
      r.estado === 'CONFIRMADA' &&
      ((r.fechaInicio < fechaFin && r.fechaFin > fechaInicio))
    );
  }

  actualizar(id, datosActualizados) {
    const reserva = this.obtenerPorId(id);
    if (reserva) {
      Object.assign(reserva, datosActualizados);
      return reserva;
    }
    return null;
  }

  eliminar(id) {
    const index = this.reservas.findIndex(r => r.id === id);
    if (index > -1) {
      this.reservas.splice(index, 1);
      return true;
    }
    return false;
  }

  limpiar() {
    this.reservas = [];
  }
}

module.exports = new ReservaRepository();
