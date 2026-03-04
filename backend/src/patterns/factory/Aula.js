const Ambiente = require('./Ambiente');

class Aula extends Ambiente {
  constructor(datos) {
    super(datos);
    this.tipo = 'AULA';
  }

  descripcion() {
    return `Aula: ${super.descripcion()}`;
  }
}

module.exports = Aula;
