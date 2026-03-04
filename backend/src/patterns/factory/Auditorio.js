const Ambiente = require('./Ambiente');

class Auditorio extends Ambiente {
  constructor(datos) {
    super(datos);
    this.tipo = 'AUDITORIO';
  }

  descripcion() {
    return `Auditorio: ${super.descripcion()}`;
  }
}

module.exports = Auditorio;
