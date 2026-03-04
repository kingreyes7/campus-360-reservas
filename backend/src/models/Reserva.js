/**
 * Modelo: Reserva
 * Representa una reserva de ambiente por parte de un estudiante
 */
class Reserva {
  constructor(id, usuarioId, ambienteId, fechaInicio, fechaFin, motivo) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.ambienteId = ambienteId;
    this.fechaInicio = fechaInicio; // Date object
    this.fechaFin = fechaFin; // Date object
    this.motivo = motivo;
    this.estado = 'PENDIENTE'; // 'PENDIENTE', 'CONFIRMADA', 'RECHAZADA', 'CANCELADA'
    this.motivoRechazo = null;
    this.fechaCreacion = new Date();
    this.fechaConfirmacion = null;
    this.usuarioValidadorId = null; // ID del Jefe de Área que validó
  }

  estaActiva() {
    return this.estado === 'CONFIRMADA';
  }

  estaPendiente() {
    return this.estado === 'PENDIENTE';
  }

  estaConfirmada() {
    return this.estado === 'CONFIRMADA';
  }

  estaRechazada() {
    return this.estado === 'RECHAZADA';
  }

  estaCancelada() {
    return this.estado === 'CANCELADA';
  }

  confirmar(usuarioValidadorId) {
    if (this.estado === 'PENDIENTE') {
      this.estado = 'CONFIRMADA';
      this.usuarioValidadorId = usuarioValidadorId;
      this.fechaConfirmacion = new Date();
      return true;
    }
    return false;
  }

  rechazar(motivo, usuarioValidadorId) {
    if (this.estado === 'PENDIENTE') {
      this.estado = 'RECHAZADA';
      this.motivoRechazo = motivo;
      this.usuarioValidadorId = usuarioValidadorId;
      return true;
    }
    return false;
  }

  cancelar() {
    if (this.estado === 'CONFIRMADA' || this.estado === 'PENDIENTE') {
      this.estado = 'CANCELADA';
      return true;
    }
    return false;
  }

  getDuracionHoras() {
    const diferencia = this.fechaFin - this.fechaInicio;
    return diferencia / (1000 * 60 * 60);
  }
}

module.exports = Reserva;
