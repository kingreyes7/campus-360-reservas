/**
 * Utilitarios para manejo de errores y respuestas
 */

/**
 * Respuesta exitosa
 */
function respuestaExitosa(res, datos, mensaje = 'Operación exitosa', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    mensaje,
    datos
  });
}

/**
 * Respuesta de error
 */
function respuestaError(res, mensaje = 'Error en la operación', statusCode = 400, detalles = null) {
  return res.status(statusCode).json({
    success: false,
    mensaje,
    detalles
  });
}

/**
 * Manejo global de errores
 */
function manejadorErrores(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.message.includes('no encontrado')) {
    return respuestaError(res, err.message, 404);
  }

  if (err.message.includes('no tienes permisos') || err.message.includes('No tienes')) {
    return respuestaError(res, err.message, 403);
  }

  if (err.message.includes('inválido') || err.message.includes('Datos incompletos')) {
    return respuestaError(res, err.message, 400);
  }

  return respuestaError(res, 'Error interno del servidor', 500);
}

module.exports = {
  respuestaExitosa,
  respuestaError,
  manejadorErrores
};
