// Interfaz simple para observadores del patrón Observer
// Un observador debe implementar un método `actualizar(evento)`.
class Observador {
  actualizar(evento) {
    throw new Error('El método actualizar debe ser implementado por la subclase');
  }
}

module.exports = Observador;
