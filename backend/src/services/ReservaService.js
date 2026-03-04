/**
 * ReservaService
 * Servicio de lógica de negocio para reservas
 * Implementa todas las reglas de negocio (RN01-RN10)
 */

const { v4: uuidv4 } = require('uuid');
const usuarioRepository = require('../repositories/UsuarioRepository');
const ambienteRepository = require('../repositories/AmbienteRepository');
const reservaRepository = require('../repositories/ReservaRepository');
const bloqueoRepository = require('../repositories/BloqueoMantenimientoRepository');
const notificacionRepository = require('../repositories/NotificacionRepository');
const Reserva = require('../models/Reserva');
const Notificacion = require('../models/Notificacion');

class ReservaService {
  /**
   * Crear una reserva
   * RN01: Un estudiante solo puede tener una reserva activa
   * RN05: No pueden existir reservas superpuestas
   * RN06: Toda reserva inicia en estado PENDIENTE
   */
  crearReserva(usuarioId, ambienteId, fechaInicio, fechaFin, motivo) {
    // Delegar validaciones a métodos privados para mejorar claridad
    const usuario = this._obtenerUsuarioValido(usuarioId);
    const ambiente = this._obtenerAmbienteValido(ambienteId);

    this._validarFechas(fechaInicio, fechaFin);
    this._validarNoBloqueo(ambienteId, fechaInicio, fechaFin);
    this._validarSinReservasActivas(usuarioId);
    this._verificarConflictoHorario(ambienteId, fechaInicio, fechaFin);

    const reserva = new Reserva(
      uuidv4(),
      usuarioId,
      ambienteId,
      fechaInicio,
      fechaFin,
      motivo
    );

    const reservaGuardada = reservaRepository.crearReserva(reserva);

    // Notificar al usuario (se marca leída para no incrementar badge en creador)
    const noti = this._generarNotificacion(
      usuarioId,
      'RESERVA_CREADA',
      'Reserva registrada',
      `Tu solicitud de reserva para ${ambiente.nombre} está siendo validada`
    );
    if (noti) {
      notificacionRepository.marcarComoLeida(noti.id);
    }

    return reservaGuardada;
  }

  // Helpers para separar responsabilidades
  _obtenerUsuarioValido(usuarioId) {
    const usuario = usuarioRepository.obtenerPorId(usuarioId);
    if (!usuario) throw new Error('Usuario no encontrado');
    if (!usuario.esEstudiante()) throw new Error('Solo estudiantes pueden crear reservas');
    return usuario;
  }

  _obtenerAmbienteValido(ambienteId) {
    const ambiente = ambienteRepository.obtenerPorId(ambienteId);
    if (!ambiente) throw new Error('Ambiente no encontrado');
    return ambiente;
  }

  _validarFechas(fechaInicio, fechaFin) {
    if (fechaInicio >= fechaFin) throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    if (fechaInicio < new Date()) throw new Error('No se puede reservar en el pasado');
  }

  _validarNoBloqueo(ambienteId, fechaInicio, fechaFin) {
    const tieneBloqueo = bloqueoRepository.obtenerEnRango(
      ambienteId,
      fechaInicio,
      fechaFin
    ).length > 0;
    if (tieneBloqueo) throw new Error('El ambiente está bloqueado por mantenimiento en ese período');
  }

  _validarSinReservasActivas(usuarioId) {
    const reservasActivas = reservaRepository.obtenerActivasPorUsuario(usuarioId);
    if (reservasActivas.length > 0) {
      throw new Error('Ya tienes una reserva activa. Cancela la anterior antes de crear una nueva.');
    }
  }

  /**
   * Confirmar una reserva (Solo Jefe de Área)
   * RN04: Toda reserva debe ser validada por el Jefe de Área
   */
  confirmarReserva(reservaId, usuarioValidadorId) {
    const validador = usuarioRepository.obtenerPorId(usuarioValidadorId);
    if (!validador || !validador.esJefeArea()) {
      throw new Error('Solo los Jefes de Área pueden validar reservas');
    }

    const reserva = reservaRepository.obtenerPorId(reservaId);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (!reserva.estaPendiente()) {
      throw new Error('La reserva no está en estado pendiente');
    }

    const confirmada = reserva.confirmar(usuarioValidadorId);
    if (!confirmada) {
      throw new Error('No se pudo confirmar la reserva');
    }

    reservaRepository.actualizar(reservaId, {
      estado: 'CONFIRMADA',
      usuarioValidadorId: usuarioValidadorId,
      fechaConfirmacion: new Date()
    });

    // RN10: Generar notificación
    const usuario = usuarioRepository.obtenerPorId(reserva.usuarioId);
    const ambiente = ambienteRepository.obtenerPorId(reserva.ambienteId);

    this._generarNotificacion(
      reserva.usuarioId,
      'RESERVA_CONFIRMADA',
      'Reserva confirmada',
      `Tu reserva para ${ambiente.nombre} ha sido confirmada`
    );

    return reserva;
  }

  /**
   * Rechazar una reserva (Solo Jefe de Área)
   */
  rechazarReserva(reservaId, motivo, usuarioValidadorId) {
    const validador = usuarioRepository.obtenerPorId(usuarioValidadorId);
    if (!validador || !validador.esJefeArea()) {
      throw new Error('Solo los Jefes de Área pueden rechazar reservas');
    }

    const reserva = reservaRepository.obtenerPorId(reservaId);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (!reserva.estaPendiente()) {
      throw new Error('La reserva no está en estado pendiente');
    }

    const rechazada = reserva.rechazar(motivo, usuarioValidadorId);
    if (!rechazada) {
      throw new Error('No se pudo rechazar la reserva');
    }

    reservaRepository.actualizar(reservaId, {
      estado: 'RECHAZADA',
      motivoRechazo: motivo,
      usuarioValidadorId: usuarioValidadorId
    });

    // RN10: Generar notificación
    const usuario = usuarioRepository.obtenerPorId(reserva.usuarioId);
    const ambiente = ambienteRepository.obtenerPorId(reserva.ambienteId);

    this._generarNotificacion(
      reserva.usuarioId,
      'RESERVA_RECHAZADA',
      'Reserva rechazada',
      `Tu reserva para ${ambiente.nombre} ha sido rechazada. Motivo: ${motivo}`
    );

    return reserva;
  }

  /**
   * Cancelar una reserva
   * RN03: Cancelación solo permitida hasta 24h antes
   */
  cancelarReserva(reservaId, usuarioId) {
    const reserva = reservaRepository.obtenerPorId(reservaId);
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    // Verificar que el usuario sea el propietario de la reserva
    if (reserva.usuarioId !== usuarioId) {
      throw new Error('Solo puedes cancelar tus propias reservas');
    }

    // RN03: Cancelación solo permitida hasta 24h antes
    const ahora = new Date();
    const horasRestantes = (reserva.fechaInicio - ahora) / (1000 * 60 * 60);

    if (horasRestantes < 24) {
      throw new Error('Solo puedes cancelar reservas con al menos 24 horas de anticipación');
    }

    if (!reserva.estaConfirmada() && !reserva.estaPendiente()) {
      throw new Error('No puedes cancelar una reserva que ya fue rechazada o cancelada');
    }

    const cancelada = reserva.cancelar();
    if (!cancelada) {
      throw new Error('No se pudo cancelar la reserva');
    }

    reservaRepository.actualizar(reservaId, {
      estado: 'CANCELADA'
    });

    // RN10: Generar notificación
    const ambiente = ambienteRepository.obtenerPorId(reserva.ambienteId);

    this._generarNotificacion(
      reserva.usuarioId,
      'RESERVA_CANCELADA',
      'Reserva cancelada',
      `Tu reserva para ${ambiente.nombre} ha sido cancelada`
    );

    return reserva;
  }

  /**
   * Obtener reserva por ID
   */
  obtenerReserva(id) {
    return reservaRepository.obtenerPorId(id);
  }

  /**
   * Obtener todas las reservas (para Jefe de Área)
   */
  obtenerTodasLasReservas() {
    return reservaRepository.obtenerTodas();
  }

  /**
   * Obtener reservas pendientes (para Jefe de Área)
   */
  obtenerReservasPendientes() {
    return reservaRepository.obtenerPendientes();
  }

  /**
   * Obtener reservas de un usuario (RN09: Estudiantes solo ven sus propias reservas)
   */
  obtenerReservasUsuario(usuarioId) {
    return reservaRepository.obtenerPorUsuario(usuarioId);
  }

  /**
   * Obtener reservas confirmadas de un ambiente
   */
  obtenerReservasAmbiente(ambienteId) {
    return reservaRepository.obtenerPorAmbiente(ambienteId)
      .filter(r => r.estado === 'CONFIRMADA');
  }

  /**
   * Método privado: Verificar conflicto de horario
   * RN05: No pueden existir reservas superpuestas
   */
  _verificarConflictoHorario(ambienteId, fechaInicio, fechaFin) {
    const reservasEnRango = reservaRepository.obtenerEnRango(
      ambienteId,
      fechaInicio,
      fechaFin
    );
    return reservasEnRango.length > 0;
  }

  /**
   * Método privado: Generar notificación
   * RN10: Toda acción genera notificación
   */
  _generarNotificacion(usuarioId, tipo, titulo, mensaje) {
    const notificacion = new Notificacion(
      uuidv4(),
      usuarioId,
      tipo,
      titulo,
      mensaje
    );
    return notificacionRepository.crearNotificacion(notificacion);
  }
}

module.exports = new ReservaService();
