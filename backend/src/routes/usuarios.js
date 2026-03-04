/**
 * Rutas de Usuarios
 */

const express = require('express');
const router = express.Router();
const usuarioService = require('../services/UsuarioService');
const { autenticar, requiereRol } = require('../middleware/autenticacion');
const { respuestaExitosa, respuestaError } = require('../utils/respuestas');

/**
 * GET /usuarios
 * Obtener todos los usuarios (Solo ADMIN)
 */
router.get('/', autenticar, requiereRol('ADMIN'), (req, res) => {
  try {
    const usuarios = usuarioService.obtenerTodos();
    // No devolver información sensible
    const usuariosSeguro = usuarios.map(u => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      activo: u.activo
    }));
    return respuestaExitosa(res, usuariosSeguro, 'Usuarios obtenidos');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * GET /usuarios/:id
 * Obtener usuario por ID
 */
router.get('/:id', autenticar, (req, res) => {
  try {
    // Solo pueden ver su propio perfil, a menos que sean ADMIN
    if (req.usuario.id !== req.params.id && !req.usuario.esAdmin()) {
      return respuestaError(res, 'No tienes permisos para ver este perfil', 403);
    }

    const usuario = usuarioService.obtenerUsuario(req.params.id);
    if (!usuario) {
      return respuestaError(res, 'Usuario no encontrado', 404);
    }

    return respuestaExitosa(res, {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo
    }, 'Usuario obtenido');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * GET /usuarios/:id/notificaciones
 * Obtener notificaciones del usuario
 */
router.get('/:id/notificaciones', autenticar, (req, res) => {
  try {
    // Solo pueden ver sus propias notificaciones
    if (req.usuario.id !== req.params.id) {
      return respuestaError(res, 'No tienes permisos', 403);
    }

    const notificaciones = usuarioService.obtenerNotificacionesUsuario(req.params.id);
    return respuestaExitosa(res, notificaciones, 'Notificaciones obtenidas');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * GET /usuarios/:id/notificaciones/no-leidas
 * Obtener notificaciones no leídas
 */
router.get('/:id/notificaciones/no-leidas', autenticar, (req, res) => {
  try {
    // Solo pueden ver sus propias notificaciones
    if (req.usuario.id !== req.params.id) {
      return respuestaError(res, 'No tienes permisos', 403);
    }

    const notificaciones = usuarioService.obtenerNotificacionesNoLeidas(req.params.id);
    return respuestaExitosa(res, notificaciones, 'Notificaciones no leídas obtenidas');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * PUT /usuarios/:id/notificaciones/:notificacionId/leer
 * Marcar notificación como leída
 */
router.put('/:id/notificaciones/:notificacionId/leer', autenticar, (req, res) => {
  try {
    // Solo pueden marcar sus propias notificaciones
    if (req.usuario.id !== req.params.id) {
      return respuestaError(res, 'No tienes permisos', 403);
    }

    usuarioService.marcarNotificacionComoLeida(req.params.notificacionId);
    return respuestaExitosa(res, null, 'Notificación marcada como leída');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * PUT /usuarios/:id/notificaciones/todas/leer
 * Marcar todas las notificaciones como leídas
 */
router.put('/:id/notificaciones/todas/leer', autenticar, (req, res) => {
  try {
    // Solo pueden marcar sus propias notificaciones
    if (req.usuario.id !== req.params.id) {
      return respuestaError(res, 'No tienes permisos', 403);
    }

    usuarioService.marcarTodasComoLeidas(req.params.id);
    return respuestaExitosa(res, null, 'Todas las notificaciones marcadas como leídas');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

module.exports = router;
