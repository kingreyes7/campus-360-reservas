/**
 * Rutas de Reservas
 */

const express = require('express');
const router = express.Router();
const reservaService = require('../services/ReservaService');
const { autenticar, requiereRol } = require('../middleware/autenticacion');
const { respuestaExitosa, respuestaError } = require('../utils/respuestas');

/**
 * GET /reservas
 * Obtener reservas (según rol)
 * - JEFE_AREA: todas las reservas
 * - ESTUDIANTE: solo sus propias reservas
 */
router.get('/', autenticar, (req, res) => {
  try {
    let reservas;

    if (req.usuario.esJefeArea()) {
      // Jefe de área ve todas las reservas
      const filtro = req.query.estado;
      if (filtro === 'PENDIENTE') {
        reservas = reservaService.obtenerReservasPendientes();
      } else {
        reservas = reservaService.obtenerTodasLasReservas();
      }
    } else if (req.usuario.esEstudiante()) {
      // RN09: Estudiantes solo ven sus propias reservas
      reservas = reservaService.obtenerReservasUsuario(req.usuario.id);
    } else {
      return respuestaError(res, 'No tienes permisos', 403);
    }

    return respuestaExitosa(res, reservas, 'Reservas obtenidas');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * GET /reservas/:id
 * Obtener reserva por ID
 */
router.get('/:id', autenticar, (req, res) => {
  try {
    const reserva = reservaService.obtenerReserva(req.params.id);
    if (!reserva) {
      return respuestaError(res, 'Reserva no encontrada', 404);
    }

    // Validar permisos
    if (req.usuario.esEstudiante() && reserva.usuarioId !== req.usuario.id) {
      return respuestaError(res, 'No tienes permisos para ver esta reserva', 403);
    }

    return respuestaExitosa(res, reserva, 'Reserva obtenida');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * POST /reservas
 * Crear una nueva reserva (Solo ESTUDIANTE)
 */
router.post('/', autenticar, requiereRol('ESTUDIANTE'), (req, res) => {
  try {
    const { ambienteId, fechaInicio, fechaFin, motivo } = req.body;

    if (!ambienteId || !fechaInicio || !fechaFin || !motivo) {
      return respuestaError(res, 'Datos incompletos', 400);
    }

    const reserva = reservaService.crearReserva(
      req.usuario.id,
      ambienteId,
      new Date(fechaInicio),
      new Date(fechaFin),
      motivo
    );

    return respuestaExitosa(res, reserva, 'Reserva creada', 201);
  } catch (error) {
    return respuestaError(res, error.message, 400);
  }
});

/**
 * PUT /reservas/:id/confirmar
 * Confirmar reserva (Solo JEFE_AREA)
 */
router.put('/:id/confirmar', autenticar, requiereRol('JEFE_AREA'), (req, res) => {
  try {
    const reserva = reservaService.confirmarReserva(req.params.id, req.usuario.id);
    return respuestaExitosa(res, reserva, 'Reserva confirmada');
  } catch (error) {
    return respuestaError(res, error.message, 400);
  }
});

/**
 * PUT /reservas/:id/rechazar
 * Rechazar reserva (Solo JEFE_AREA)
 */
router.put('/:id/rechazar', autenticar, requiereRol('JEFE_AREA'), (req, res) => {
  try {
    const { motivo } = req.body;
    if (!motivo) {
      return respuestaError(res, 'Motivo de rechazo es requerido', 400);
    }

    const reserva = reservaService.rechazarReserva(req.params.id, motivo, req.usuario.id);
    return respuestaExitosa(res, reserva, 'Reserva rechazada');
  } catch (error) {
    return respuestaError(res, error.message, 400);
  }
});

/**
 * PUT /reservas/:id/cancelar
 * Cancelar reserva (El propietario de la reserva)
 */
router.put('/:id/cancelar', autenticar, (req, res) => {
  try {
    const reserva = reservaService.cancelarReserva(req.params.id, req.usuario.id);
    return respuestaExitosa(res, reserva, 'Reserva cancelada');
  } catch (error) {
    return respuestaError(res, error.message, 400);
  }
});

module.exports = router;
