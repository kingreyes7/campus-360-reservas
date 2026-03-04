/**
 * AmbienteRepository
 * Repositorio para gestionar ambientes en memoria
 */

class AmbienteRepository {
  constructor() {
    this.ambientes = [];
  }

  crearAmbiente(ambiente) {
    this.ambientes.push(ambiente);
    return ambiente;
  }

  obtenerPorId(id) {
    return this.ambientes.find(a => a.id === id) || null;
  }

  obtenerTodos() {
    return [...this.ambientes];
  }

  obtenerPorTipo(tipo) {
    return this.ambientes.filter(a => a.tipo === tipo);
  }

  obtenerDisponibles() {
    return this.ambientes.filter(a => a.estado === 'DISPONIBLE');
  }

  obtenerPorCapacidadMinima(capacidad) {
    return this.ambientes.filter(a => a.capacidad >= capacidad && a.estado === 'DISPONIBLE');
  }

  actualizar(id, datosActualizados) {
    const ambiente = this.obtenerPorId(id);
    if (ambiente) {
      Object.assign(ambiente, datosActualizados);
      return ambiente;
    }
    return null;
  }

  eliminar(id) {
    const index = this.ambientes.findIndex(a => a.id === id);
    if (index > -1) {
      this.ambientes.splice(index, 1);
      return true;
    }
    return false;
  }

  limpiar() {
    this.ambientes = [];
  }
}

module.exports = new AmbienteRepository();
