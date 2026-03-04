/**
 * Rutas de Bloqueos de Mantenimiento
 */

const express = require('express');
const router = express.Router();
const bloqueoService = require('../services/BloqueoMantenimientoService');
const { autenticar, requiereRol } = require('../middleware/autenticacion');
const { respuestaExitosa, respuestaError } = require('../utils/respuestas');
const { ROLES } = require('../utils/constants');
const { safe } = require('../utils/routeWrapper');

/**
 * GET /bloqueos
 * Obtener todos los bloqueos (Solo ADMIN y JEFE_AREA)
 */
router.get('/', autenticar, requiereRol(ROLES.ADMIN, ROLES.JEFE_AREA), safe((req, res) => {
  const bloqueos = bloqueoService.obtenerTodos();
  return respuestaExitosa(res, bloqueos, 'Bloqueos obtenidos');
}));

/**
 * GET /bloqueos/:id
 * Obtener bloqueo por ID
 */
router.get('/:id', autenticar, requiereRol(ROLES.ADMIN, ROLES.JEFE_AREA), safe((req, res) => {
  const bloqueo = bloqueoService.obtenerBloqueo(req.params.id);
  if (!bloqueo) {
    return respuestaError(res, 'Bloqueo no encontrado', 404);
  }
  return respuestaExitosa(res, bloqueo, 'Bloqueo obtenido');
}));

/**
 * GET /bloqueos/ambiente/:ambienteId
 * Obtener bloqueos de un ambiente específico
 */
router.get('/ambiente/:ambienteId', autenticar, safe((req, res) => {
  const bloqueos = bloqueoService.obtenerBloqueosPorAmbiente(req.params.ambienteId);
  return respuestaExitosa(res, bloqueos, 'Bloqueos del ambiente obtenidos');
}));

/**
 * POST /bloqueos
 * Crear bloqueo de mantenimiento (Solo ADMIN)
 */
router.post('/', autenticar, requiereRol(ROLES.ADMIN), safe((req, res) => {
  const { ambienteId, fechaInicio, fechaFin, descripcion } = req.body;

  if (!ambienteId || !fechaInicio || !fechaFin || !descripcion) {
    return respuestaError(res, 'Datos incompletos', 400);
  }

  const bloqueo = bloqueoService.crearBloqueo(
    ambienteId,
    new Date(fechaInicio),
    new Date(fechaFin),
    descripcion,
    req.usuario.id
  );

  return respuestaExitosa(res, bloqueo, 'Bloqueo creado', 201);
}));

/**
 * PUT /bloqueos/:id/completar
 * Marcar bloqueo como completado (Solo ADMIN)
 */
router.put('/:id/completar', autenticar, requiereRol(ROLES.ADMIN), safe((req, res) => {
  const bloqueo = bloqueoService.marcarBloqueoComoCompletado(req.params.id);
  return respuestaExitosa(res, bloqueo, 'Bloqueo marcado como completado');
}));

/**
 * DELETE /bloqueos/:id
 * Eliminar bloqueo (Solo ADMIN)
 */
router.delete('/:id', autenticar, requiereRol(ROLES.ADMIN), safe((req, res) => {
  bloqueoService.eliminarBloqueo(req.params.id);
  return respuestaExitosa(res, null, 'Bloqueo eliminado');
}));

module.exports = router;
