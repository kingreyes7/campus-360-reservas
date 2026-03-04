// Clase abstracta que define la API común para cualquier tipo de ambiente
// utilizada en el patrón Factory. No se debe instanciar directamente.
class Ambiente {
  constructor({ id, nombre, ubicacion, capacidad, recursos = [] }) {
    if (new.target === Ambiente) {
      throw new Error('No se puede instanciar la clase Ambiente directamente');
    }
    this.id = id;
    this.nombre = nombre;
    this.ubicacion = ubicacion;
    this.capacidad = capacidad;
    this.recursos = recursos;
    this.estado = 'DISPONIBLE';
    this.fechaCreacion = new Date();
  }

  // Método de ejemplo que puede ser sobrescrito por las subclases
  descripcion() {
    return `${this.nombre} (${this.ubicacion})`;
  }
}

module.exports = Ambiente;
