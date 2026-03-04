/**
 * AmbienteService
 * Servicio de lógica de negocio para ambientes
 */

const usuarioRepository = require('../repositories/UsuarioRepository');
const ambienteRepository = require('../repositories/AmbienteRepository');
const reservaRepository = require('../repositories/ReservaRepository');
const bloqueoRepository = require('../repositories/BloqueoMantenimientoRepository');

class AmbienteService {
  /**
   * Crear un ambiente (Solo ADMIN)
   * RN08: Crear ambiente no afecta reservas existentes
   */
  crearAmbiente(ambienteData) {
    if (!ambienteData.id || !ambienteData.nombre || !ambienteData.capacidad) {
      throw new Error('Datos incompletos para crear ambiente');
    }

    const ambienteExistente = ambienteRepository.obtenerPorId(ambienteData.id);
    if (ambienteExistente) {
      throw new Error('El ambiente ya existe');
    }

    return ambienteRepository.crearAmbiente(ambienteData);
  }

  /**
   * Actualizar ambiente (Solo ADMIN)
   * RN08: Modificar ambientes no afecta reservas confirmadas
   */
  actualizarAmbiente(id, datosActualizados) {
    const ambiente = ambienteRepository.obtenerPorId(id);
    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    // No se puede cambiar ID
    if (datosActualizados.id && datosActualizados.id !== id) {
      throw new Error('No se puede cambiar el ID del ambiente');
    }

    return ambienteRepository.actualizar(id, datosActualizados);
  }

  /**
   * Eliminar ambiente (Solo ADMIN)
   * RN07: No se puede eliminar un ambiente con reservas o bloqueos
   */
  eliminarAmbiente(id) {
    const ambiente = ambienteRepository.obtenerPorId(id);
    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    // Verificar si hay reservas confirmadas o pendientes
    const reservasActivas = reservaRepository.obtenerPorAmbiente(id)
      .filter(r => r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE');

    if (reservasActivas.length > 0) {
      throw new Error(`No se puede eliminar el ambiente. Tiene ${reservasActivas.length} reservas activas`);
    }

    // Verificar si hay bloqueos activos
    const bloqueosActivos = bloqueoRepository.obtenerActivosPorAmbiente(id);
    if (bloqueosActivos.length > 0) {
      throw new Error(`No se puede eliminar el ambiente. Tiene ${bloqueosActivos.length} bloqueos de mantenimiento`);
    }

    return ambienteRepository.eliminar(id);
  }

  /**
   * Obtener ambiente por ID
   */
  obtenerAmbiente(id) {
    return ambienteRepository.obtenerPorId(id);
  }

  /**
   * Obtener todos los ambientes
   */
  obtenerTodos() {
    return ambienteRepository.obtenerTodos();
  }

  /**
   * Obtener ambientes disponibles
   */
  obtenerDisponibles() {
    return ambienteRepository.obtenerDisponibles();
  }

  /**
   * Buscar ambientes con filtros
   */
  buscarAmbientes(filtros = {}) {
    let ambientes = ambienteRepository.obtenerTodos();

    if (filtros.tipo) {
      ambientes = ambientes.filter(a => a.tipo === filtros.tipo);
    }

    if (filtros.capacidadMinima) {
      ambientes = ambientes.filter(a => a.capacidad >= filtros.capacidadMinima);
    }

    if (filtros.estado) {
      ambientes = ambientes.filter(a => a.estado === filtros.estado);
    }

    // Filtrar por disponibilidad en fecha/horario
    if (filtros.fechaInicio && filtros.fechaFin) {
      ambientes = ambientes.filter(ambiente => {
        // Verificar que no tenga bloqueos
        const tieneBloqueo = bloqueoRepository.obtenerEnRango(
          ambiente.id,
          filtros.fechaInicio,
          filtros.fechaFin
        ).length > 0;

        if (tieneBloqueo) return false;

        // Verificar que no tenga reservas confirmadas
        const tieneReserva = reservaRepository.obtenerEnRango(
          ambiente.id,
          filtros.fechaInicio,
          filtros.fechaFin
        ).length > 0;

        return !tieneReserva;
      });
    }

    return ambientes;
  }

  /**
   * Cambiar estado del ambiente
   */
  cambiarEstadoAmbiente(id, nuevoEstado) {
    const ambiente = ambienteRepository.obtenerPorId(id);
    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    const actualizado = ambiente.cambiarEstado(nuevoEstado);
    if (!actualizado) {
      throw new Error('Estado inválido');
    }

    return ambienteRepository.actualizar(id, { estado: nuevoEstado });
  }
}

module.exports = new AmbienteService();
