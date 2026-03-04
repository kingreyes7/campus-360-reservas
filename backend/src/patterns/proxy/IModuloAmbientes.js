// Interfaz para el módulo de ambientes. Define los métodos que tanto el real
// como el proxy deben exponer. En JavaScript simplemente describimos los
// nombres y firmas esperando que las implementaciones cumplan.

class IModuloAmbientes {
  listar(usuario) {
    throw new Error('listar debe ser implementado');
  }

  crear(usuario, datosAmbiente) {
    throw new Error('crear debe ser implementado');
  }

  modificar(usuario, id, datos) {
    throw new Error('modificar debe ser implementado');
  }
}

module.exports = IModuloAmbientes;
