const Observador = require('./Observador');

// Observador concreto que representa un servicio de notificaciones.
// Recibe eventos con la información del cambio de estado de un ambiente.
class SistemaNotificaciones extends Observador {
  constructor(nombre) {
    super();
    this.nombre = nombre || 'NotificadorPrincipal';
  }

  actualizar(evento) {
    // En un entorno real enviaríamos correos, SMS, etc.
    // Aquí simplemente escribimos un mensaje en consola.
    console.log(`[${this.nombre}] Notificación -> Ambiente '${evento.ambiente.nombre}' cambió de estado de '${evento.prevEstado}' a '${evento.nuevoEstado}'`);
  }
}

module.exports = SistemaNotificaciones;
