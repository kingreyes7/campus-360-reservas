/**
 * Rutas de Autenticación
 */

const express = require('express');
const router = express.Router();
const usuarioService = require('../services/UsuarioService');
const { generarToken } = require('../middleware/autenticacion');
const { respuestaExitosa, respuestaError } = require('../utils/respuestas');

/**
 * POST /auth/login
 * Simulación de login con email
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return respuestaError(res, 'Email es requerido', 400);
    }

    const usuario = usuarioService.obtenerPorEmail(email);
    if (!usuario) {
      return respuestaError(res, 'Credenciales inválidas', 401);
    }

    // Generar token simulado
    const token = generarToken(usuario.id);

    return respuestaExitosa(res, {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    }, 'Login exitoso');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

/**
 * POST /auth/logout
 */
router.post('/logout', (req, res) => {
  return respuestaExitosa(res, null, 'Logout exitoso');
});

/**
 * GET /auth/me
 * Obtener datos del usuario autenticado
 */
router.get('/me', (req, res) => {
  try {
    if (!req.usuario) {
      return respuestaError(res, 'No autenticado', 401);
    }

    return respuestaExitosa(res, {
      id: req.usuario.id,
      nombre: req.usuario.nombre,
      email: req.usuario.email,
      rol: req.usuario.rol
    }, 'Datos del usuario');
  } catch (error) {
    return respuestaError(res, error.message, 500);
  }
});

module.exports = router;
