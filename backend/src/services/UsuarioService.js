/**
 * UsuarioService
 * Servicio de lógica de negocio para usuarios
 */

const usuarioRepository = require('../repositories/UsuarioRepository');
const notificacionRepository = require('../repositories/NotificacionRepository');
const Usuario = require('../models/Usuario');

class UsuarioService {
  /**
   * Crear un usuario (Para inicialización del sistema)
   */
  crearUsuario(id, nombre, email, rol, codigoEstudiante = null) {
    const usuarioExistente = usuarioRepository.obtenerPorEmail(email);
    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }

    const usuario = new Usuario(id, nombre, email, rol, codigoEstudiante);
    return usuarioRepository.crearUsuario(usuario);
  }

  /**
   * Obtener usuario por ID
   */
  obtenerUsuario(id) {
    return usuarioRepository.obtenerPorId(id);
  }

  /**
   * Obtener usuario por email (para login)
   */
  obtenerPorEmail(email) {
    return usuarioRepository.obtenerPorEmail(email);
  }

  /**
   * Obtener todos los usuarios (para ADMIN)
   */
  obtenerTodos() {
    return usuarioRepository.obtenerTodos();
  }

  /**
   * Obtener usuarios por rol
   */
  obtenerPorRol(rol) {
    return usuarioRepository.obtenerPorRol(rol);
  }

  /**
   * Actualizar usuario
   */
  actualizarUsuario(id, datosActualizados) {
    const usuario = usuarioRepository.obtenerPorId(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuarioRepository.actualizar(id, datosActualizados);
  }

  /**
   * Eliminar usuario
   */
  eliminarUsuario(id) {
    return usuarioRepository.eliminar(id);
  }

  /**
   * Obtener notificaciones del usuario
   */
  obtenerNotificacionesUsuario(usuarioId) {
    return notificacionRepository.obtenerPorUsuario(usuarioId);
  }

  /**
   * Obtener notificaciones no leídas del usuario
   */
  obtenerNotificacionesNoLeidas(usuarioId) {
    return notificacionRepository.obtenerNoLeidasPorUsuario(usuarioId);
  }

  /**
   * Marcar notificación como leída
   */
  marcarNotificacionComoLeida(notificacionId) {
    return notificacionRepository.marcarComoLeida(notificacionId);
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  marcarTodasComoLeidas(usuarioId) {
    return notificacionRepository.marcarTodasComoLeidasPorUsuario(usuarioId);
  }
}

module.exports = new UsuarioService();
