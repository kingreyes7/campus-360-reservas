/**
 * BloqueoMantenimientoService
 * Servicio de lógica de negocio para bloqueos de mantenimiento
 */

const { v4: uuidv4 } = require('uuid');
const usuarioRepository = require('../repositories/UsuarioRepository');
const ambienteRepository = require('../repositories/AmbienteRepository');
const bloqueoRepository = require('../repositories/BloqueoMantenimientoRepository');
const notificacionRepository = require('../repositories/NotificacionRepository');
const BloqueoMantenimiento = require('../models/BloqueoMantenimiento');
const Notificacion = require('../models/Notificacion');

class BloqueoMantenimientoService {
  /**
   * Crear un bloqueo de mantenimiento (Solo ADMIN)
   * RN02: Bloqueos por mantenimiento tienen prioridad
   */
  crearBloqueo(ambienteId, fechaInicio, fechaFin, descripcion, creadoPor) {
    const creador = usuarioRepository.obtenerPorId(creadoPor);
    if (!creador || !creador.esAdmin()) {
      throw new Error('Solo administradores pueden crear bloqueos de mantenimiento');
    }

    const ambiente = ambienteRepository.obtenerPorId(ambienteId);
    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    // Validar fechas
    if (fechaInicio >= fechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    // Crear bloqueo
    const bloqueo = new BloqueoMantenimiento(
      uuidv4(),
      ambienteId,
      fechaInicio,
      fechaFin,
      descripcion,
      creadoPor
    );

    const bloqueoGuardado = bloqueoRepository.crearBloqueo(bloqueo);

    // Cambiar estado del ambiente si no está en mantenimiento
    if (ambiente.estado !== 'EN_MANTENIMIENTO') {
      ambienteRepository.actualizar(ambienteId, {
        estado: 'EN_MANTENIMIENTO'
      });
    }

    return bloqueoGuardado;
  }

  /**
   * Obtener bloqueo por ID
   */
  obtenerBloqueo(id) {
    return bloqueoRepository.obtenerPorId(id);
  }

  /**
   * Obtener todos los bloqueos
   */
  obtenerTodos() {
    return bloqueoRepository.obtenerTodos();
  }

  /**
   * Obtener bloqueos de un ambiente
   */
  obtenerBloqueosPorAmbiente(ambienteId) {
    return bloqueoRepository.obtenerPorAmbiente(ambienteId);
  }

  /**
   * Obtener bloqueos activos
   */
  obtenerBloqueosActivos() {
    return bloqueoRepository.obtenerActivos();
  }

  /**
   * Marcar bloqueo como completado
   */
  marcarBloqueoComoCompletado(id) {
    const bloqueo = bloqueoRepository.obtenerPorId(id);
    if (!bloqueo) {
      throw new Error('Bloqueo no encontrado');
    }

    bloqueo.marcarCompletado();
    bloqueoRepository.actualizar(id, { estado: 'COMPLETADO' });

    // Cambiar estado del ambiente a disponible si no hay más bloqueos activos
    const bloqueosActivos = bloqueoRepository.obtenerActivosPorAmbiente(bloqueo.ambienteId);
    if (bloqueosActivos.length === 0) {
      ambienteRepository.actualizar(bloqueo.ambienteId, {
        estado: 'DISPONIBLE'
      });
    }

    return bloqueo;
  }

  /**
   * Eliminar un bloqueo
   */
  eliminarBloqueo(id) {
    const bloqueo = bloqueoRepository.obtenerPorId(id);
    if (!bloqueo) {
      throw new Error('Bloqueo no encontrado');
    }

    bloqueoRepository.eliminar(id);

    // Cambiar estado del ambiente a disponible si no hay más bloqueos activos
    const bloqueosActivos = bloqueoRepository.obtenerActivosPorAmbiente(bloqueo.ambienteId);
    if (bloqueosActivos.length === 0) {
      ambienteRepository.actualizar(bloqueo.ambienteId, {
        estado: 'DISPONIBLE'
      });
    }

    return true;
  }

  /**
   * Verificar si hay bloqueos en un rango de fechas
   */
  verificarBloqueoEnRango(ambienteId, fechaInicio, fechaFin) {
    const bloqueos = bloqueoRepository.obtenerEnRango(
      ambienteId,
      fechaInicio,
      fechaFin
    );
    return bloqueos.length > 0;
  }
}

module.exports = new BloqueoMantenimientoService();
