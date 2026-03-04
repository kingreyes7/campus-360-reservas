/**
 * Middleware de Autenticación
 * Simula autenticación JWT sin dependencias externas
 */

const usuarioRepository = require('../repositories/UsuarioRepository');

// Simular storage de tokens
const tokensActivos = new Map();

/**
 * Generar un token simulado
 */
function generarToken(usuarioId) {
  const token = `token_${usuarioId}_${Date.now()}`;
  tokensActivos.set(token, {
    usuarioId,
    creadoEn: new Date()
  });
  return token;
}

/**
 * Verificar token y obtener usuario
 */
function verificarToken(token) {
  if (!token) return null;

  const tokenData = tokensActivos.get(token);
  if (!tokenData) return null;

  const usuario = usuarioRepository.obtenerPorId(tokenData.usuarioId);
  return usuario || null;
}

/**
 * Middleware para verificar token
 */
function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      mensaje: 'Token no proporcionado'
    });
  }

  const usuario = verificarToken(token);
  if (!usuario) {
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado'
    });
  }

  req.usuario = usuario;
  req.token = token;
  next();
}

/**
 * Middleware para verificar rol
 */
function requiereRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
}

/**
 * Limpiar token (logout)
 */
function limpiarToken(token) {
  tokensActivos.delete(token);
}

module.exports = {
  generarToken,
  verificarToken,
  autenticar,
  requiereRol,
  limpiarToken
};
