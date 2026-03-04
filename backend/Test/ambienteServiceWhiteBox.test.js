/**
 * Tests Caja Blanca - AmbienteService
 * Adaptado al AmbienteService REAL del proyecto
 */

const AmbienteService = require('../src/services/AmbienteService');
const ambienteRepository = require('../src/repositories/AmbienteRepository');
const reservaRepository = require('../src/repositories/ReservaRepository');
const bloqueoRepository = require('../src/repositories/BloqueoMantenimientoRepository');

jest.mock('../src/repositories/AmbienteRepository');
jest.mock('../src/repositories/ReservaRepository');
jest.mock('../src/repositories/BloqueoMantenimientoRepository');

describe('AmbienteService - White Box Testing', () => {
  let mockAmbiente;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAmbiente = {
      id: 'amb-1',
      nombre: 'Aula 101',
      capacidad: 30,
      tipo: 'AULA',
      estado: 'DISPONIBLE'
    };
  });

  // ============================================
  // obtenerAmbiente - Ambiente encontrado/no encontrado
  // ============================================
  test('RAMA 1: obtenerAmbiente - Ambiente encontrado', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);

    const resultado = AmbienteService.obtenerAmbiente('amb-1');

    expect(resultado).toEqual(mockAmbiente);
    expect(ambienteRepository.obtenerPorId).toHaveBeenCalledWith('amb-1');
  });

  test('RAMA 2: obtenerAmbiente - Ambiente no encontrado', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(null);

    const resultado = AmbienteService.obtenerAmbiente('amb-inexistente');

    expect(resultado).toBeNull();
  });

  // ============================================
  // obtenerTodos - Retorna todos los ambientes
  // ============================================
  test('RAMA 3: obtenerTodos - Retorna lista de ambientes', () => {
    const mockAmbientes = [
      mockAmbiente,
      { ...mockAmbiente, id: 'amb-2', nombre: 'Aula 102' }
    ];
    ambienteRepository.obtenerTodos.mockReturnValue(mockAmbientes);

    const resultado = AmbienteService.obtenerTodos();

    expect(resultado).toEqual(mockAmbientes);
    expect(ambienteRepository.obtenerTodos).toHaveBeenCalled();
  });

  // ============================================
  // obtenerDisponibles - Ambientes disponibles
  // ============================================
  test('RAMA 4: obtenerDisponibles - Retorna disponibles', () => {
    const mockDisponibles = [mockAmbiente];
    ambienteRepository.obtenerDisponibles.mockReturnValue(mockDisponibles);

    const resultado = AmbienteService.obtenerDisponibles();

    expect(resultado).toEqual(mockDisponibles);
  });

  // ============================================
  // buscarAmbientes - Filtrado por tipo
  // ============================================
  test('RAMA 5: buscarAmbientes - Filtra por tipo AULA', () => {
    const mockAulas = [
      mockAmbiente,
      { ...mockAmbiente, id: 'amb-2', tipo: 'AULA' }
    ];
    ambienteRepository.obtenerTodos.mockReturnValue(mockAulas);

    const resultado = AmbienteService.buscarAmbientes({ tipo: 'AULA' });

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every(a => a.tipo === 'AULA')).toBe(true);
  });

  test('RAMA 6: buscarAmbientes - Filtra por capacidad mínima', () => {
    const mockAmbientes = [
      mockAmbiente, // capacidad 30
      { ...mockAmbiente, id: 'amb-2', capacidad: 50 },
      { ...mockAmbiente, id: 'amb-3', capacidad: 20 }
    ];
    ambienteRepository.obtenerTodos.mockReturnValue(mockAmbientes);

    const resultado = AmbienteService.buscarAmbientes({ capacidadMinima: 25 });

    expect(resultado).toContainEqual(mockAmbiente);
    expect(resultado).toContainEqual({ ...mockAmbiente, id: 'amb-2', capacidad: 50 });
    expect(resultado.length).toBe(2);
  });

  test('RAMA 7: buscarAmbientes - Filtra por estado', () => {
    const mockAmbientes = [
      { ...mockAmbiente, estado: 'DISPONIBLE' },
      { ...mockAmbiente, id: 'amb-2', estado: 'NO_DISPONIBLE' }
    ];
    ambienteRepository.obtenerTodos.mockReturnValue(mockAmbientes);

    const resultado = AmbienteService.buscarAmbientes({ estado: 'DISPONIBLE' });

    expect(resultado.every(a => a.estado === 'DISPONIBLE')).toBe(true);
  });

  // ============================================
  // buscarAmbientes - Filtrado por fecha/horario
  // ============================================
  test('RAMA 8: buscarAmbientes - Disponible en rango de fechas', () => {
    const mockAmbientes = [mockAmbiente];
    ambienteRepository.obtenerTodos.mockReturnValue(mockAmbientes);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]); // Sin bloqueos
    reservaRepository.obtenerEnRango.mockReturnValue([]); // Sin reservas

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    const resultado = AmbienteService.buscarAmbientes({
      fechaInicio: fecha1,
      fechaFin: fecha2
    });

    expect(resultado.length).toBe(1);
  });

  test('RAMA 9: buscarAmbientes - NO disponible (tiene bloqueo)', () => {
    const mockAmbientes = [mockAmbiente];
    ambienteRepository.obtenerTodos.mockReturnValue(mockAmbientes);
    bloqueoRepository.obtenerEnRango.mockReturnValue([{ id: 'bloqueo-1' }]); // Con bloqueo

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    const resultado = AmbienteService.buscarAmbientes({
      fechaInicio: fecha1,
      fechaFin: fecha2
    });

    expect(resultado).toHaveLength(0);
  });

  test('RAMA 10: buscarAmbientes - NO disponible (tiene reserva)', () => {
    const mockAmbientes = [mockAmbiente];
    ambienteRepository.obtenerTodos.mockReturnValue(mockAmbientes);
    bloqueoRepository.obtenerEnRango.mockReturnValue([]); // Sin bloqueos
    reservaRepository.obtenerEnRango.mockReturnValue([{ id: 'res-1' }]); // Con reserva

    const fecha1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const fecha2 = new Date(Date.now() + 50 * 60 * 60 * 1000);

    const resultado = AmbienteService.buscarAmbientes({
      fechaInicio: fecha1,
      fechaFin: fecha2
    });

    expect(resultado).toHaveLength(0);
  });

  // ============================================
  // crearAmbiente - Validaciones
  // ============================================
  test('RAMA 11: crearAmbiente - Datos incompletos lanza error', () => {
    expect(() => {
      AmbienteService.crearAmbiente({ id: 'amb-1' }); // Faltan nombre y capacidad
    }).toThrow('Datos incompletos');
  });

  test('RAMA 12: crearAmbiente - Ambiente ya existe lanza error', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);

    expect(() => {
      AmbienteService.crearAmbiente({
        id: 'amb-1',
        nombre: 'Aula 101',
        capacidad: 30
      });
    }).toThrow('El ambiente ya existe');
  });

  test('RAMA 13: crearAmbiente - Creación exitosa', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(null); // No existe
    ambienteRepository.crearAmbiente.mockReturnValue(mockAmbiente);

    const resultado = AmbienteService.crearAmbiente({
      id: 'amb-1',
      nombre: 'Aula 101',
      capacidad: 30
    });

    expect(resultado).toEqual(mockAmbiente);
    expect(ambienteRepository.crearAmbiente).toHaveBeenCalled();
  });

  // ============================================
  // actualizarAmbiente - Validaciones
  // ============================================
  test('RAMA 14: actualizarAmbiente - Ambiente no encontrado', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(null);

    expect(() => {
      AmbienteService.actualizarAmbiente('amb-inexistente', { nombre: 'Nuevo' });
    }).toThrow('Ambiente no encontrado');
  });

  test('RAMA 15: actualizarAmbiente - Intenta cambiar ID', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);

    expect(() => {
      AmbienteService.actualizarAmbiente('amb-1', { id: 'amb-2' });
    }).toThrow('No se puede cambiar el ID');
  });

  test('RAMA 16: actualizarAmbiente - Actualización exitosa', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    const actualizado = { ...mockAmbiente, nombre: 'Aula 102' };
    ambienteRepository.actualizar.mockReturnValue(actualizado);

    const resultado = AmbienteService.actualizarAmbiente('amb-1', {
      nombre: 'Aula 102'
    });

    expect(resultado).toEqual(actualizado);
    expect(ambienteRepository.actualizar).toHaveBeenCalled();
  });

  // ============================================
  // eliminarAmbiente - Validaciones
  // ============================================
  test('RAMA 17: eliminarAmbiente - Ambiente no encontrado', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(null);

    expect(() => {
      AmbienteService.eliminarAmbiente('amb-inexistente');
    }).toThrow('Ambiente no encontrado');
  });

  test('RAMA 18: eliminarAmbiente - Tiene reservas activas', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    reservaRepository.obtenerPorAmbiente.mockReturnValue([
      { estado: 'CONFIRMADA' }
    ]);

    expect(() => {
      AmbienteService.eliminarAmbiente('amb-1');
    }).toThrow('No se puede eliminar');
  });

  test('RAMA 19: eliminarAmbiente - Tiene bloqueos activos', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    reservaRepository.obtenerPorAmbiente.mockReturnValue([]); // Sin reservas
    bloqueoRepository.obtenerActivosPorAmbiente.mockReturnValue([
      { id: 'bloqueo-1' }
    ]);

    expect(() => {
      AmbienteService.eliminarAmbiente('amb-1');
    }).toThrow('No se puede eliminar');
  });

  test('RAMA 20: eliminarAmbiente - Eliminación exitosa', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbiente);
    reservaRepository.obtenerPorAmbiente.mockReturnValue([]); // Sin reservas
    bloqueoRepository.obtenerActivosPorAmbiente.mockReturnValue([]); // Sin bloqueos
    ambienteRepository.eliminar.mockReturnValue(true);

    const resultado = AmbienteService.eliminarAmbiente('amb-1');

    expect(resultado).toBe(true);
    expect(ambienteRepository.eliminar).toHaveBeenCalledWith('amb-1');
  });

  // ============================================
  // cambiarEstadoAmbiente - Cambio de estado
  // ============================================
  test('RAMA 21: cambiarEstadoAmbiente - Ambiente no encontrado', () => {
    ambienteRepository.obtenerPorId.mockReturnValue(null);

    expect(() => {
      AmbienteService.cambiarEstadoAmbiente('amb-inexistente', 'NO_DISPONIBLE');
    }).toThrow('Ambiente no encontrado');
  });

  test('RAMA 22: cambiarEstadoAmbiente - Estado inválido', () => {
    const mockAmbienteConError = {
      ...mockAmbiente,
      cambiarEstado: jest.fn().mockReturnValue(false)
    };
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbienteConError);

    expect(() => {
      AmbienteService.cambiarEstadoAmbiente('amb-1', 'ESTADO_INVALIDO');
    }).toThrow('Estado inválido');
  });

  test('RAMA 23: cambiarEstadoAmbiente - Cambio exitoso', () => {
    const mockAmbienteConEstado = {
      ...mockAmbiente,
      cambiarEstado: jest.fn().mockReturnValue(true)
    };
    ambienteRepository.obtenerPorId.mockReturnValue(mockAmbienteConEstado);
    ambienteRepository.actualizar.mockReturnValue({ ...mockAmbiente, estado: 'NO_DISPONIBLE' });

    const resultado = AmbienteService.cambiarEstadoAmbiente('amb-1', 'NO_DISPONIBLE');

    expect(resultado).toBeDefined();
    expect(ambienteRepository.actualizar).toHaveBeenCalledWith(
      'amb-1',
      { estado: 'NO_DISPONIBLE' }
    );
  });
});
