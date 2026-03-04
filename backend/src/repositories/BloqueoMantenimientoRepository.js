/**
 * BloqueoMantenimientoRepository
 * Repositorio para gestionar bloqueos de mantenimiento en memoria
 */

class BloqueoMantenimientoRepository {
  constructor() {
    this.bloqueos = [];
  }

  crearBloqueo(bloqueo) {
    this.bloqueos.push(bloqueo);
    return bloqueo;
  }

  obtenerPorId(id) {
    return this.bloqueos.find(b => b.id === id) || null;
  }

  obtenerTodos() {
    return [...this.bloqueos];
  }

  obtenerPorAmbiente(ambienteId) {
    return this.bloqueos.filter(b => b.ambienteId === ambienteId);
  }

  obtenerActivos() {
    return this.bloqueos.filter(b => b.estado === 'ACTIVO');
  }

  obtenerActivosPorAmbiente(ambienteId) {
    return this.bloqueos.filter(b => 
      b.ambienteId === ambienteId && 
      b.estado === 'ACTIVO' &&
      new Date() < b.fechaFin
    );
  }

  obtenerEnRango(ambienteId, fechaInicio, fechaFin) {
    return this.bloqueos.filter(b =>
      b.ambienteId === ambienteId &&
      b.estado === 'ACTIVO' &&
      (b.fechaInicio < fechaFin && b.fechaFin > fechaInicio)
    );
  }

  actualizar(id, datosActualizados) {
    const bloqueo = this.obtenerPorId(id);
    if (bloqueo) {
      Object.assign(bloqueo, datosActualizados);
      return bloqueo;
    }
    return null;
  }

  eliminar(id) {
    const index = this.bloqueos.findIndex(b => b.id === id);
    if (index > -1) {
      this.bloqueos.splice(index, 1);
      return true;
    }
    return false;
  }

  limpiar() {
    this.bloqueos = [];
  }
}

module.exports = new BloqueoMantenimientoRepository();
