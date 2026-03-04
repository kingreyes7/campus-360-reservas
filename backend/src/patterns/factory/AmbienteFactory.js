// Fábrica para crear instancias de Ambientes sin acoplar el código a las clases concretas.
// Se utiliza un mapa interno para evitar if/else extensos y facilitar la extensión.

const Aula = require('./Aula');
const Laboratorio = require('./Laboratorio');
const Auditorio = require('./Auditorio');

class AmbienteFactory {
  constructor() {
    // mapa de "tipo" -> constructor
    this._constructores = {
      AULA: Aula,
      LABORATORIO: Laboratorio,
      AUDITORIO: Auditorio,
    };
  }

  // permite registrar nuevos tipos en tiempo de ejecución
  registrarTipo(tipo, constructorFn) {
    this._constructores[tipo] = constructorFn;
  }

  crearAmbiente(tipo, datos) {
    const Clase = this._constructores[tipo];
    if (!Clase) {
      throw new Error(`Tipo de ambiente desconocido: ${tipo}`);
    }
    return new Clase(datos);
  }
}

module.exports = new AmbienteFactory();
