const IModuloAmbientes = require('./IModuloAmbientes');
const ModuloAmbientesReal = require('./ModuloAmbientesReal');

// Proxy que controla el acceso al módulo de ambientes verificando autenticación
// y autorización.
class ModuloAmbientesProxy extends IModuloAmbientes {
  constructor() {
    super();
    this._real = new ModuloAmbientesReal();
  }

  _verificarAcceso(usuario, accion) {
    if (!usuario || !usuario.autenticado) {
      throw new Error('Usuario no autenticado');
    }
    if (accion === 'crear' || accion === 'modificar') {
      if (usuario.rol !== 'ADMIN') {
        throw new Error('Usuario no autorizado para crear/modificar ambientes');
      }
    }
    // listar está permitido para cualquier usuario autenticado
  }

  listar(usuario) {
    this._verificarAcceso(usuario, 'listar');
    return this._real.listar(usuario);
  }

  crear(usuario, datosAmbiente) {
    this._verificarAcceso(usuario, 'crear');
    return this._real.crear(usuario, datosAmbiente);
  }

  modificar(usuario, id, datos) {
    this._verificarAcceso(usuario, 'modificar');
    return this._real.modificar(usuario, id, datos);
  }
}

module.exports = ModuloAmbientesProxy;
