/**
 * NotificacionRepository
 * Repositorio para gestionar notificaciones en memoria
 */

class NotificacionRepository {
  constructor() {
    this.notificaciones = [];
  }

  crearNotificacion(notificacion) {
    this.notificaciones.push(notificacion);
    return notificacion;
  }

  obtenerPorId(id) {
    return this.notificaciones.find(n => n.id === id) || null;
  }

  obtenerTodas() {
    return [...this.notificaciones];
  }

  obtenerPorUsuario(usuarioId) {
    return this.notificaciones.filter(n => n.usuarioId === usuarioId);
  }

  obtenerNoLeidasPorUsuario(usuarioId) {
    return this.notificaciones.filter(n => 
      n.usuarioId === usuarioId && !n.leida
    );
  }

  marcarComoLeida(id) {
    const notificacion = this.obtenerPorId(id);
    if (notificacion) {
      notificacion.marcarComoLeida();
      return true;
    }
    return false;
  }

  marcarTodasComoLeidasPorUsuario(usuarioId) {
    const notificaciones = this.obtenerPorUsuario(usuarioId);
    notificaciones.forEach(n => n.marcarComoLeida());
    return true;
  }

  eliminar(id) {
    const index = this.notificaciones.findIndex(n => n.id === id);
    if (index > -1) {
      this.notificaciones.splice(index, 1);
      return true;
    }
    return false;
  }

  limpiar() {
    this.notificaciones = [];
  }
}

module.exports = new NotificacionRepository();
