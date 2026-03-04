/**
 * Modelo: Notificación
 * Registra notificaciones generadas por acciones en el sistema
 */
class Notificacion {
  constructor(id, usuarioId, tipo, titulo, mensaje, relatedReservaId = null) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.tipo = tipo; // 'RESERVA_CONFIRMADA', 'RESERVA_RECHAZADA', 'RESERVA_CANCELADA', 'NUEVO_BLOQUEO'
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.relatedReservaId = relatedReservaId;
    this.leida = false;
    this.fechaCreacion = new Date();
  }

  marcarComoLeida() {
    this.leida = true;
  }
}

module.exports = Notificacion;
