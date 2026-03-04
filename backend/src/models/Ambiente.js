/**
 * Modelo: Ambiente
 * Representa un ambiente universitario (laboratorio, salón, auditorio, etc.)
 *
 * También actúa como sujeto en el patrón Observer. Los observadores pueden
 * suscribirse para recibir notificaciones cuando el estado del ambiente
 * cambie a "EN_MANTENIMIENTO" o "INACTIVO".
 */
class Ambiente {
  constructor(id, nombre, ubicacion, tipo, capacidad, recursos = []) {
    this.id = id;
    this.nombre = nombre;
    this.ubicacion = ubicacion;
    this.tipo = tipo; // 'LABORATORIO', 'SALON', 'AUDITORIO', etc.
    this.capacidad = capacidad;
    this.recursos = recursos; // ['Proyector', 'Pizarra', 'Aire acondicionado']
    this.estado = 'DISPONIBLE'; // 'DISPONIBLE', 'EN_MANTENIMIENTO', 'INACTIVO'
    this.fechaCreacion = new Date();

    // Lista de observadores suscritos al sujeto.
    this._observadores = [];
  }

  esDisponible() {
    return this.estado === 'DISPONIBLE';
  }

  estaEnMantenimiento() {
    return this.estado === 'EN_MANTENIMIENTO';
  }

  cambiarEstado(nuevoEstado) {
    if (['DISPONIBLE', 'EN_MANTENIMIENTO', 'INACTIVO'].includes(nuevoEstado)) {
      const anterior = this.estado;
      this.estado = nuevoEstado;
      // notificar observadores si cambiamos a mantenimiento o inactivo
      if (['EN_MANTENIMIENTO', 'INACTIVO'].includes(nuevoEstado) && anterior !== nuevoEstado) {
        this._notificar({
          ambiente: this,
          prevEstado: anterior,
          nuevoEstado: nuevoEstado,
        });
      }
      return true;
    }
    return false;
  }

  // ===== Métodos del patrón Observer =====
  agregarObservador(observador) {
    if (observador && typeof observador.actualizar === 'function') {
      this._observadores.push(observador);
    }
  }

  removerObservador(observador) {
    this._observadores = this._observadores.filter(o => o !== observador);
  }

  _notificar(evento) {
    this._observadores.forEach(o => o.actualizar(evento));
  }
}

module.exports = Ambiente;
