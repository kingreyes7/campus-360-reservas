/**
 * Tests Caja Blanca - ReservaService
 * Cobertura exhaustiva de ramas (branch coverage)
 */

const ReservaService = require('../src/services/ReservaService');
const usuarioRepository = require('../src/repositories/UsuarioRepository');
const ambienteRepository = require('../src/repositories/AmbienteRepository');
const reservaRepository = require('../src/repositories/ReservaRepository');
const bloqueoRepository = require('../src/repositories/BloqueoMantenimientoRepository');
const notificacionRepository = require('../src/repositories/NotificacionRepository');
const Usuario = require('../src/models/Usuario');
const Ambiente = require('../src/models/Ambiente');
const Reserva = require('../src/models/Reserva');

// Mockear repositorios
jest.mock('../src/repositories/UsuarioRepository');
jest.mock('../src/repositories/AmbienteRepository');
jest.mock('../src/repositories/ReservaRepository');
jest.mock('../src/repositories/BloqueoMantenimientoRepository');
jest.mock('../src/repositories/NotificacionRepository');

describe('ReservaService - Caja Blanca (Branch Coverage)', () => {
  let mockUsuario, mockAmbiente, mockReserva;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockUsuario = {
      id: 'user-1',
      esEstudiante: jest.fn().mockReturnValue(true),
      esJefeArea: jest.fn().mockReturnValue(false),
      nombre: 'Juan Pérez'
    };

    mockAmbiente = {
      id: 'amb-1',
      nombre: 'Aula 101',
      capacidad: 30
    };

    mockReserva = {
      id: 'res-1',
      usuarioId: 'user-1',
      ambienteId: 'amb-1',
      fechaInicio: new Date(Date.now() + 48 * 60 * 60 * 1000),
      fechaFin: new Date(Date.now() + 50 * 60 * 60 * 1000),
      estado: 'PENDIENTE',
      estaPendiente: jest.fn().mockReturnValue(true),
      estaConfirmada: jest.fn().mockReturnValue(false),
      confirmar: jest.fn().mockReturnValue(true),
      rechazar: jest.fn().mockReturnValue(true),
      cancelar: jest.fn().mockReturnValue(true)
    };
  });

  // ============================================
  // crearReserva - Rama 1: Usuario no encontrado
  // ============================================
  test('RAMA 1: crearReserva - Usuario no encontrado lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(null);

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('Usuario no encontrado');
  });

  // ============================================
  // crearReserva - Rama 2: Usuario no es estudiante
  // ============================================
  test('RAMA 2: crearReserva - Usuario no es estudiante lanza error', () => {
    mockUsuario.esEstudiante.mockReturnValue(false);
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('Solo estudiantes pueden crear reservas');
  });

  // ============================================
  // crearReserva - Rama 3: Ambiente no encontrado
  // ============================================
  test('RAMA 3: crearReserva - Ambiente no encontrado lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(null);

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('Ambiente no encontrado');
  });

  // ============================================
  // crearReserva - Rama 4: Ambiente bloqueado por mantenimiento
  // ============================================
  test('RAMA 4: crearReserva - Ambiente bloqueado por mantenimiento lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([{ id: 'bloqueo-1' }]); // Simular bloqueo

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('El ambiente está bloqueado por mantenimiento en ese período');

    expect(bloqueoRepository.obtenerEnRango).toHaveBeenCalledWith('amb-1', fecha1, fecha2);
  });

  // ============================================
  // crearReserva - Rama 5: Conflicto de horario
  // ============================================
  test('RAMA 5: crearReserva - Conflicto de horario existente lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]); // Sin bloqueos
    reservaRepository.obtenerEnRango.mockReturnValue([{ id: 'res-existente' }]); // Conflicto

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('Ya existe una reserva en ese horario');
  });

  // ============================================
  // crearReserva - Rama 6: Usuario tiene reserva activa
  // ============================================
  test('RAMA 6: crearReserva - Usuario ya tiene reserva activa lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerActivasPorUsuario.mockReturnValue([{ id: 'res-activa' }]); // Reserva activa

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('Ya tienes una reserva activa. Cancela la anterior antes de crear una nueva.');
  });

  // ============================================
  // crearReserva - Rama 7: Fecha de inicio >= fecha de fin
  // ============================================
  test('RAMA 7: crearReserva - Fecha inicio >= fecha fin lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerActivasPorUsuario.mockReturnValue([]);

    const fecha1 = new Date(Date.now() + 50 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 48 * 60 * 60 * 1000); // Fin antes que inicio

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('La fecha de inicio debe ser anterior a la fecha de fin');
  });

  // ============================================
  // crearReserva - Rama 8: Reserva en el pasado
  // ============================================
  test('RAMA 8: crearReserva - Reserva en el pasado lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerActivasPorUsuario.mockReturnValue([]);

    const fecha1 = new Date(Date.now() - 10 * 60 * 60 * 1000); // Pasado
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');
    }).toThrow('No se puede reservar en el pasado');
  });

  // ============================================
  // crearReserva - Rama 9: Reserva exitosa (happy path)
  // ============================================
  test('RAMA 9: crearReserva - Reserva creada exitosamente', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerActivasPorUsuario.mockReturnValue([]);

    const reservaGuardada = { ...mockReserva, id: 'res-nueva' };
    reservaRepository.crearReserva.mockReturnValue(reservaGuardada);
    notificacionRepository.crearNotificacion.mockReturnValue({ id: 'noti-1' });
    notificacionRepository.marcarComoLeida.mockReturnValue(true);

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    const resultado = ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');

    expect(resultado).toEqual(reservaGuardada);
    expect(reservaRepository.crearReserva).toHaveBeenCalled();
    expect(notificacionRepository.crearNotificacion).toHaveBeenCalled();
  });

  // ============================================
  // crearReserva - Rama 10: Notificación sin marcar como leída
  // ============================================
  test('RAMA 10: crearReserva - Notificación no creada no genera error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerActivasPorUsuario.mockReturnValue([]);

    const reservaGuardada = { ...mockReserva, id: 'res-nueva' };
    reservaRepository.crearReserva.mockReturnValue(reservaGuardada);
    notificacionRepository.crearNotificacion.mockReturnValue(null); // Sin notificación

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    const resultado = ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Proyecto');

    expect(resultado).toEqual(reservaGuardada);
    expect(notificacionRepository.marcarComoLeida).not.toHaveBeenCalled();
  });

  // ============================================
  // confirmarReserva - Rama 1: Validador no encontrado
  // ============================================
  test('RAMA 11: confirmarReserva - Validador no encontrado lanza error', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(null);

    expect(() => {
      ReservaService.confirmarReserva('res-1', 'user-jefe');
    }).toThrow('Solo los Jefes de Área pueden validar reservas');
  });

  // ============================================
  // confirmarReserva - Rama 2: Validador no es Jefe de Área
  // ============================================
  test('RAMA 12: confirmarReserva - Validador no es Jefe de Área lanza error', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(false) };
    usuarioRepository.obtenerPorId.mockReturnValue(mockJefe);

    expect(() => {
      ReservaService.confirmarReserva('res-1', 'user-jefe');
    }).toThrow('Solo los Jefes de Área pueden validar reservas');
  });

  // ============================================
  // confirmarReserva - Rama 3: Reserva no encontrada
  // ============================================
  test('RAMA 13: confirmarReserva - Reserva no encontrada lanza error', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    usuarioRepository.obtenerPorId.mockReturnValue(mockJefe);
    reservaRepository.obtenerPorId.mockReturnValue(null);

    expect(() => {
      ReservaService.confirmarReserva('res-1', 'user-jefe');
    }).toThrow('Reserva no encontrada');
  });

  // ============================================
  // confirmarReserva - Rama 4: Reserva no está pendiente
  // ============================================
  test('RAMA 14: confirmarReserva - Reserva no está pendiente lanza error', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    const mockReservaConfirmada = { ...mockReserva, estaPendiente: jest.fn().mockReturnValue(false) };

    usuarioRepository.obtenerPorId.mockReturnValue(mockJefe);
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaConfirmada);

    expect(() => {
      ReservaService.confirmarReserva('res-1', 'user-jefe');
    }).toThrow('La reserva no está en estado pendiente');
  });

  // ============================================
  // confirmarReserva - Rama 5: Error al confirmar reserva
  // ============================================
  test('RAMA 15: confirmarReserva - Error al confirmar lanza excepción', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    const mockReservaFallo = { ...mockReserva, confirmar: jest.fn().mockReturnValue(false) };

    usuarioRepository.obtenerPorId.mockReturnValue(mockJefe);
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaFallo);

    expect(() => {
      ReservaService.confirmarReserva('res-1', 'user-jefe');
    }).toThrow('No se pudo confirmar la reserva');
  });

  // ============================================
  // confirmarReserva - Rama 6: Confirmación exitosa
  // ============================================
  test('RAMA 16: confirmarReserva - Reserva confirmada exitosamente', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    usuarioRepository.obtenerPorId
      .mockReturnValueOnce(mockJefe) // Primera llamada para validador
      .mockReturnValueOnce(mockUsuario); // Segunda llamada para usuario notificación

    reservaRepository.obtenerPorId.mockReturnValue(mockReserva);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    notificacionRepository.crearNotificacion.mockReturnValue({ id: 'noti-1' });

    const resultado = ReservaService.confirmarReserva('res-1', 'user-jefe');

    expect(resultado).toEqual(mockReserva);
    expect(reservaRepository.actualizar).toHaveBeenCalledWith('res-1', expect.objectContaining({
      estado: 'CONFIRMADA',
      usuarioValidadorId: 'user-jefe'
    }));
    expect(notificacionRepository.crearNotificacion).toHaveBeenCalled();
  });

  // ============================================
  // rechazarReserva - Rama 1: Validador no es Jefe de Área
  // ============================================
  test('RAMA 17: rechazarReserva - Validador no es Jefe de Área lanza error', () => {
    const mockNoJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(false) };
    usuarioRepository.obtenerPorId.mockReturnValue(mockNoJefe);

    expect(() => {
      ReservaService.rechazarReserva('res-1', 'Motivo', 'user-jefe');
    }).toThrow('Solo los Jefes de Área pueden rechazar reservas');
  });

  // ============================================
  // rechazarReserva - Rama 2: Reserva no encontrada
  // ============================================
  test('RAMA 18: rechazarReserva - Reserva no encontrada lanza error', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    usuarioRepository.obtenerPorId.mockReturnValue(mockJefe);
    reservaRepository.obtenerPorId.mockReturnValue(null);

    expect(() => {
      ReservaService.rechazarReserva('res-1', 'Motivo', 'user-jefe');
    }).toThrow('Reserva no encontrada');
  });

  // ============================================
  // rechazarReserva - Rama 3: Reserva no está pendiente
  // ============================================
  test('RAMA 19: rechazarReserva - Reserva no está pendiente lanza error', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    const mockReservaNoP = { ...mockReserva, estaPendiente: jest.fn().mockReturnValue(false) };

    usuarioRepository.obtenerPorId.mockReturnValue(mockJefe);
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaNoP);

    expect(() => {
      ReservaService.rechazarReserva('res-1', 'Motivo', 'user-jefe');
    }).toThrow('La reserva no está en estado pendiente');
  });

  // ============================================
  // rechazarReserva - Rama 4: Error al rechazar
  // ============================================
  test('RAMA 20: rechazarReserva - Error al rechazar lanza excepción', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    const mockReservaFallo = { ...mockReserva, rechazar: jest.fn().mockReturnValue(false) };

    usuarioRepository.obtenerPorId.mockReturnValue(mockJefe);
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaFallo);

    expect(() => {
      ReservaService.rechazarReserva('res-1', 'Motivo', 'user-jefe');
    }).toThrow('No se pudo rechazar la reserva');
  });

  // ============================================
  // rechazarReserva - Rama 5: Rechazo exitoso
  // ============================================
  test('RAMA 21: rechazarReserva - Reserva rechazada exitosamente', () => {
    const mockJefe = { ...mockUsuario, esJefeArea: jest.fn().mockReturnValue(true) };
    usuarioRepository.obtenerPorId
      .mockReturnValueOnce(mockJefe)
      .mockReturnValueOnce(mockUsuario);

    reservaRepository.obtenerPorId.mockReturnValue(mockReserva);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    notificacionRepository.crearNotificacion.mockReturnValue({ id: 'noti-1' });

    const resultado = ReservaService.rechazarReserva('res-1', 'Espacio insuficiente', 'user-jefe');

    expect(resultado).toEqual(mockReserva);
    expect(reservaRepository.actualizar).toHaveBeenCalledWith('res-1', expect.objectContaining({
      estado: 'RECHAZADA',
      motivoRechazo: 'Espacio insuficiente'
    }));
  });

  // ============================================
  // cancelarReserva - Rama 1: Reserva no encontrada
  // ============================================
  test('RAMA 22: cancelarReserva - Reserva no encontrada lanza error', () => {
    reservaRepository.obtenerPorId.mockReturnValue(null);

    expect(() => {
      ReservaService.cancelarReserva('res-1', 'user-1');
    }).toThrow('Reserva no encontrada');
  });

  // ============================================
  // cancelarReserva - Rama 2: Usuario no es propietario
  // ============================================
  test('RAMA 23: cancelarReserva - Usuario no es propietario lanza error', () => {
    const mockReservaOtroUsuario = { ...mockReserva, usuarioId: 'user-2' };
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaOtroUsuario);

    expect(() => {
      ReservaService.cancelarReserva('res-1', 'user-1');
    }).toThrow('Solo puedes cancelar tus propias reservas');
  });

  // ============================================
  // cancelarReserva - Rama 3: Menos de 24 horas
  // ============================================
  test('RAMA 24: cancelarReserva - Cancelación con menos de 24h lanza error', () => {
    const fechaProxima = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 horas
    const mockReservaProxima = { ...mockReserva, fechaInicio: fechaProxima };
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaProxima);

    expect(() => {
      ReservaService.cancelarReserva('res-1', 'user-1');
    }).toThrow('Solo puedes cancelar reservas con al menos 24 horas de anticipación');
  });

  // ============================================
  // cancelarReserva - Rama 4: Reserva no confirmada ni pendiente
  // ============================================
  test('RAMA 25: cancelarReserva - Reserva rechazada no puede cancelarse', () => {
    const mockReservaRechazada = {
      ...mockReserva,
      usuarioId: 'user-1',
      fechaInicio: new Date(Date.now() + 48 * 60 * 60 * 1000),
      estaConfirmada: jest.fn().mockReturnValue(false),
      estaPendiente: jest.fn().mockReturnValue(false)
    };
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaRechazada);

    expect(() => {
      ReservaService.cancelarReserva('res-1', 'user-1');
    }).toThrow('No puedes cancelar una reserva que ya fue rechazada o cancelada');
  });

  // ============================================
  // cancelarReserva - Rama 5: Error al cancelar
  // ============================================
  test('RAMA 26: cancelarReserva - Error al cancelar lanza excepción', () => {
    const mockReservaCancelFallo = {
      ...mockReserva,
      usuarioId: 'user-1',
      fechaInicio: new Date(Date.now() + 48 * 60 * 60 * 1000),
      estaConfirmada: jest.fn().mockReturnValue(false),
      estaPendiente: jest.fn().mockReturnValue(true),
      cancelar: jest.fn().mockReturnValue(false)
    };
    reservaRepository.obtenerPorId.mockReturnValue(mockReservaCancelFallo);

    expect(() => {
      ReservaService.cancelarReserva('res-1', 'user-1');
    }).toThrow('No se pudo cancelar la reserva');
  });

  // ============================================
  // cancelarReserva - Rama 6: Cancelación exitosa
  // ============================================
  test('RAMA 27: cancelarReserva - Reserva cancelada exitosamente', () => {
    const mockReservaCancelable = {
      ...mockReserva,
      usuarioId: 'user-1',
      fechaInicio: new Date(Date.now() + 48 * 60 * 60 * 1000),
      estaConfirmada: jest.fn().mockReturnValue(true),
      cancelar: jest.fn().mockReturnValue(true)
    };

    reservaRepository.obtenerPorId.mockReturnValue(mockReservaCancelable);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    notificacionRepository.crearNotificacion.mockReturnValue({ id: 'noti-1' });

    const resultado = ReservaService.cancelarReserva('res-1', 'user-1');

    expect(resultado).toEqual(mockReservaCancelable);
    expect(reservaRepository.actualizar).toHaveBeenCalledWith('res-1', { estado: 'CANCELADA' });
    expect(notificacionRepository.crearNotificacion).toHaveBeenCalled();
  });

  // ============================================
  // Métodos getters
  // ============================================
  test('RAMA 28: obtenerReserva - Retorna reserva por ID', () => {
    reservaRepository.obtenerPorId.mockReturnValue(mockReserva);

    const resultado = ReservaService.obtenerReserva('res-1');

    expect(resultado).toEqual(mockReserva);
    expect(reservaRepository.obtenerPorId).toHaveBeenCalledWith('res-1');
  });

  test('RAMA 29: obtenerTodasLasReservas - Retorna todas las reservas', () => {
    const mockReservas = [mockReserva, { ...mockReserva, id: 'res-2' }];
    reservaRepository.obtenerTodas.mockReturnValue(mockReservas);

    const resultado = ReservaService.obtenerTodasLasReservas();

    expect(resultado).toEqual(mockReservas);
    expect(reservaRepository.obtenerTodas).toHaveBeenCalled();
  });

  test('RAMA 30: obtenerReservasPendientes - Retorna reservas pendientes', () => {
    const mockPendientes = [mockReserva];
    reservaRepository.obtenerPendientes.mockReturnValue(mockPendientes);

    const resultado = ReservaService.obtenerReservasPendientes();

    expect(resultado).toEqual(mockPendientes);
  });

  test('RAMA 31: obtenerReservasUsuario - Retorna reservas del usuario', () => {
    const mockUserReservas = [mockReserva];
    reservaRepository.obtenerPorUsuario.mockReturnValue(mockUserReservas);

    const resultado = ReservaService.obtenerReservasUsuario('user-1');

    expect(resultado).toEqual(mockUserReservas);
    expect(reservaRepository.obtenerPorUsuario).toHaveBeenCalledWith('user-1');
  });

  // ============================================
  // obtenerReservasAmbiente - Branch coverage
  // ============================================
  test('RAMA 32: obtenerReservasAmbiente - Filtra solo confirmadas (rama: confirmada)', () => {
    const mockReservas = [
      { ...mockReserva, estado: 'CONFIRMADA' },
      { ...mockReserva, id: 'res-2', estado: 'PENDIENTE' },
      { ...mockReserva, id: 'res-3', estado: 'CONFIRMADA' }
    ];
    reservaRepository.obtenerPorAmbiente.mockReturnValue(mockReservas);

    const resultado = ReservaService.obtenerReservasAmbiente('amb-1');

    expect(resultado).toHaveLength(2);
    expect(resultado.every(r => r.estado === 'CONFIRMADA')).toBe(true);
  });

  test('RAMA 33: obtenerReservasAmbiente - Retorna vacío si no hay confirmadas', () => {
    const mockReservas = [
      { ...mockReserva, estado: 'PENDIENTE' },
      { ...mockReserva, id: 'res-2', estado: 'RECHAZADA' }
    ];
    reservaRepository.obtenerPorAmbiente.mockReturnValue(mockReservas);

    const resultado = ReservaService.obtenerReservasAmbiente('amb-1');

    expect(resultado).toHaveLength(0);
  });

  // ============================================
  // Métodos privados indirectos
  // ============================================
  test('RAMA 34: _verificarConflictoHorario - Detecta conflicto', () => {
    reservaRepository.obtenerEnRango.mockReturnValue([{ id: 'conflicto' }]);

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    // Verificar indirectamente llamando a crearReserva
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    // Simulamos conflicto en rango
    reservaRepository.obtenerEnRango.mockReturnValue([{ id: 'conflict' }]);

    expect(() => {
      ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Test');
    }).toThrow('Ya existe una reserva en ese horario');
  });

  test('RAMA 35: _verificarConflictoHorario - Sin conflicto', () => {
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerEnRango.mockReturnValue([]); // Sin conflicto
    reservaRepository.obtenerActivasPorUsuario.mockReturnValue([]);
    
    const reservaGuardada = { ...mockReserva, id: 'res-nueva' };
    reservaRepository.crearReserva.mockReturnValue(reservaGuardada);
    notificacionRepository.crearNotificacion.mockReturnValue({ id: 'noti-1' });

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    const resultado = ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Test');
    expect(resultado).toEqual(reservaGuardada);
  });

  test('RAMA 36: _generarNotificacion - Crea notificación correctamente', () => {
    const mockNotificacion = { id: 'noti-1', tipo: 'RESERVA_CREADA' };
    notificacionRepository.crearNotificacion.mockReturnValue(mockNotificacion);

    // Verificar indirectamente a través de crearReserva
    usuarioRepository.obtenerPorId.mockReturnValue(mockUsuario);
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerEnRango.mockReturnValue([]);
    reservaRepository.obtenerActivasPorUsuario.mockReturnValue([]);
    
    const reservaGuardada = { ...mockReserva, id: 'res-nueva' };
    reservaRepository.crearReserva.mockReturnValue(reservaGuardada);

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    ReservaService.crearReserva('user-1', 'amb-1', fecha1, fecha2, 'Test');

    expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith(expect.objectContaining({
      usuarioId: 'user-1',
      tipo: 'RESERVA_CREADA'
    }));
  });
});
