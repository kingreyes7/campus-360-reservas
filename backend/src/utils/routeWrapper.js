/**
 * Pequeño helper para envolver handlers y delegar errores al middleware
 */
function safe(handler) {
  return function (req, res, next) {
    try {
      const result = handler(req, res, next);
      // soportar handlers sincrónicos y promesas
      if (result && typeof result.then === 'function') {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { safe };
