const IModuloAmbientes = require('./IModuloAmbientes');

// Implementación "real" que contendría la lógica verdadera del módulo de
// ambientes (acceso a base de datos, etc.). Aquí lo simulamos con mensajes.
class ModuloAmbientesReal extends IModuloAmbientes {
  listar(usuario) {
    console.log(`ModuloAmbientesReal: listando ambientes para usuario ${usuario.nombre}`);
    return []; // en la práctica consultaríamos la base de datos
  }

  crear(usuario, datosAmbiente) {
    console.log(`ModuloAmbientesReal: creando ambiente ${datosAmbiente.nombre} por ${usuario.nombre}`);
    return { id: Date.now(), ...datosAmbiente };
  }

  modificar(usuario, id, datos) {
    console.log(`ModuloAmbientesReal: modificando ambiente ${id} por ${usuario.nombre}`);
    return { id, ...datos };
  }
}

module.exports = ModuloAmbientesReal;
