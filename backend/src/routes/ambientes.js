/**
 * Rutas de Ambientes
 */

const express = require('express');
const router = express.Router();
const ambienteService = require('../services/AmbienteService');
const { autenticar, requiereRol } = require('../middleware/autenticacion');
const { respuestaExitosa, respuestaError } = require('../utils/respuestas');
const { safe } = require('../utils/routeWrapper');
const { ROLES } = require('../utils/constants');
const Ambiente = require('../models/Ambiente');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /ambientes
 * Obtener todos los ambientes (con filtros opcionales)
 */
router.get('/', autenticar, safe((req, res) => {
  const { tipo, capacidadMinima, estado, fechaInicio, fechaFin } = req.query;

  const filtros = {};
  if (tipo) filtros.tipo = tipo;
  if (capacidadMinima) filtros.capacidadMinima = parseInt(capacidadMinima);
  if (estado) filtros.estado = estado;
  if (fechaInicio && fechaFin) {
    filtros.fechaInicio = new Date(fechaInicio);
    filtros.fechaFin = new Date(fechaFin);
  }

  const ambientes = ambienteService.buscarAmbientes(filtros);
  return respuestaExitosa(res, ambientes, 'Ambientes obtenidos');
}));

/**
 * GET /ambientes/:id
 * Obtener ambiente por ID
 */
router.get('/:id', autenticar, (req, res) => {
  try {
    const ambiente = ambienteService.obtenerAmbiente(req.params.id);
    if (!ambiente) {
      return respuestaError(res, 'Ambiente no encontrado', 404);
    }
    return respuestaExitosa(res, ambiente, 'Ambiente obtenido');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * POST /ambientes
 * Crear ambiente (Solo ADMIN)
 */
router.post('/', autenticar, requiereRol(ROLES.ADMIN), safe((req, res) => {
  const { nombre, ubicacion, tipo, capacidad, recursos } = req.body;

  if (!nombre || !ubicacion || !tipo || !capacidad) {
    return respuestaError(res, 'Datos incompletos', 400);
  }

  const nuevoAmbiente = new Ambiente(
    uuidv4(),
    nombre,
    ubicacion,
    tipo,
    capacidad,
    recursos || []
  );

  const ambiente = ambienteService.crearAmbiente(nuevoAmbiente);
  return respuestaExitosa(res, ambiente, 'Ambiente creado', 201);
}));

/**
 * PUT /ambientes/:id
 * Actualizar ambiente (Solo ADMIN)
 */
router.put('/:id', autenticar, requiereRol(ROLES.ADMIN), safe((req, res) => {
  const ambiente = ambienteService.actualizarAmbiente(req.params.id, req.body);
  if (!ambiente) {
    return respuestaError(res, 'Ambiente no encontrado', 404);
  }
  return respuestaExitosa(res, ambiente, 'Ambiente actualizado');
}));

/**
 * DELETE /ambientes/:id
 * Eliminar ambiente (Solo ADMIN)
 */
router.delete('/:id', autenticar, requiereRol(ROLES.ADMIN), safe((req, res) => {
  ambienteService.eliminarAmbiente(req.params.id);
  return respuestaExitosa(res, null, 'Ambiente eliminado');
}));

module.exports = router;
