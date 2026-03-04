/**
 * Modelo: Usuario
 * Representa a un usuario del sistema (Estudiante, Jefe de Área o Admin)
 */
class Usuario {
  constructor(id, nombre, email, rol, codigoEstudiante = null) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol; // 'ESTUDIANTE', 'JEFE_AREA', 'ADMIN'
    this.codigoEstudiante = codigoEstudiante; // Solo para estudiantes
    this.activo = true;
    this.fechaCreacion = new Date();
  }

  esEstudiante() {
    return this.rol === 'ESTUDIANTE';
  }

  esJefeArea() {
    return this.rol === 'JEFE_AREA';
  }

  esAdmin() {
    return this.rol === 'ADMIN';
  }
}

module.exports = Usuario;
