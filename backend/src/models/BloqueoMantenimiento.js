/**
 * Modelo: BloqueoMantenimiento
 * Representa un período en el cual un ambiente está bloqueado por mantenimiento
 */
class BloqueoMantenimiento {
  constructor(id, ambienteId, fechaInicio, fechaFin, descripcion, creadoPor) {
    this.id = id;
    this.ambienteId = ambienteId;
    this.fechaInicio = fechaInicio; // Date object
    this.fechaFin = fechaFin; // Date object
    this.descripcion = descripcion;
    this.creadoPor = creadoPor; // ID del usuario ADMIN que creó el bloqueo
    this.estado = 'ACTIVO'; // 'ACTIVO', 'COMPLETADO'
    this.fechaCreacion = new Date();
  }

  estaActivo() {
    return this.estado === 'ACTIVO' && new Date() < this.fechaFin;
  }

  marcarCompletado() {
    this.estado = 'COMPLETADO';
    return true;
  }

  estaVigente(fecha = new Date()) {
    return fecha >= this.fechaInicio && fecha <= this.fechaFin;
  }

  getDuracionDias() {
    const diferencia = this.fechaFin - this.fechaInicio;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }
}

module.exports = BloqueoMantenimiento;
