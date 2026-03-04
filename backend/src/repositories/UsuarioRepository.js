/**
 * UsuarioRepository
 * Repositorio para gestionar usuarios en memoria
 */

class UsuarioRepository {
  constructor() {
    this.usuarios = [];
  }

  crearUsuario(usuario) {
    this.usuarios.push(usuario);
    return usuario;
  }

  obtenerPorId(id) {
    return this.usuarios.find(u => u.id === id) || null;
  }

  obtenerPorEmail(email) {
    return this.usuarios.find(u => u.email === email) || null;
  }

  obtenerTodos() {
    return [...this.usuarios];
  }

  obtenerPorRol(rol) {
    return this.usuarios.filter(u => u.rol === rol);
  }

  actualizar(id, datosActualizados) {
    const usuario = this.obtenerPorId(id);
    if (usuario) {
      Object.assign(usuario, datosActualizados);
      return usuario;
    }
    return null;
  }

  eliminar(id) {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index > -1) {
      this.usuarios.splice(index, 1);
      return true;
    }
    return false;
  }

  limpiar() {
    this.usuarios = [];
  }
}

module.exports = new UsuarioRepository();
