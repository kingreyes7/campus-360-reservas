/*
  Archivo de ejemplo que muestra cómo utilizar los tres patrones solicitados:
  - Factory (creación de Ambientes de distintos tipos)
  - Proxy (control de acceso al módulo de ambientes)
  - Observer (notificación de cambios de estado en un ambiente)

  Cada sección incluye comentarios explicativos y un pequeño escenario de uso.
*/

// ---------------- FACTORY ----------------
const AmbienteFactory = require('./factory/AmbienteFactory');

console.log('=== Patron Factory ===');
const datosBase = { id: 1, nombre: 'Ambiente 1', ubicacion: 'Edificio A', capacidad: 30 };
const aula = AmbienteFactory.crearAmbiente('AULA', datosBase);
const lab = AmbienteFactory.crearAmbiente('LABORATORIO', { ...datosBase, nombre: 'Lab 2' });
const aud = AmbienteFactory.crearAmbiente('AUDITORIO', { ...datosBase, nombre: 'Auditorio 1' });

console.log(aula.descripcion());
console.log(lab.descripcion());
console.log(aud.descripcion());

// si en el futuro queremos agregar un tipo nuevo, basta con registrar su constructor
class SalaReuniones extends require('./factory/Ambiente') {
  constructor(datos) {
    super(datos);
    this.tipo = 'SALA_REUNIONES';
  }
  descripcion() { return `Sala de reuniones: ${super.descripcion()}`; }
}
AmbienteFactory.registrarTipo('SALA_REUNIONES', SalaReuniones);
const sala = AmbienteFactory.crearAmbiente('SALA_REUNIONES', { ...datosBase, nombre: 'Sala 1' });
console.log(sala.descripcion());


// ---------------- OBSERVER ----------------
const Ambiente = require('../models/Ambiente');
const SistemaNotificaciones = require('./observer/SistemaNotificaciones');

console.log('\n=== Patron Observer ===');
const ambienteReal = new Ambiente(10, 'Taller', 'Edificio B', 'TALLER', 20);
const notificador = new SistemaNotificaciones('Notificador Central');
ambienteReal.agregarObservador(notificador);
ambienteReal.cambiarEstado('EN_MANTENIMIENTO'); // disparará la notificación
ambienteReal.cambiarEstado('INACTIVO');
ambienteReal.removerObservador(notificador);
ambienteReal.cambiarEstado('DISPONIBLE'); // ya no notificará


// ---------------- PROXY ----------------
const ModuloAmbientesProxy = require('./proxy/ModuloAmbientesProxy');

console.log('\n=== Patron Proxy ===');
const proxy = new ModuloAmbientesProxy();

const usuarioAdmin = { id: 1, nombre: 'Alice', rol: 'ADMIN', autenticado: true };
const usuarioUser = { id: 2, nombre: 'Bob', rol: 'USER', autenticado: true };
const usuarioAnon = { id: 3, nombre: 'Eve', rol: 'USER', autenticado: false };

console.log('Admin lista', proxy.listar(usuarioAdmin));
console.log('User lista', proxy.listar(usuarioUser));
try {
  proxy.crear(usuarioUser, { nombre: 'Prueba' });
} catch (e) {
  console.error('Error al crear con USER:', e.message);
}
console.log('Admin crea', proxy.crear(usuarioAdmin, { nombre: 'Nuevo ambiente' }));
try {
  proxy.listar(usuarioAnon);
} catch (e) {
  console.error('Error anon:', e.message);
}

console.log('\n=== Fin del ejemplo ===');
