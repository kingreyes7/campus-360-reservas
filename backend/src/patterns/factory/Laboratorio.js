const Ambiente = require('./Ambiente');

class Laboratorio extends Ambiente {
  constructor(datos) {
    super(datos);
    this.tipo = 'LABORATORIO';
  }

  descripcion() {
    return `Laboratorio: ${super.descripcion()}`;
  }
}

module.exports = Laboratorio;
