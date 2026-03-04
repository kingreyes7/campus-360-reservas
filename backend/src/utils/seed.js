/**
 * Utilitarios para inicializar datos de prueba
 */

const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/Usuario');
const Ambiente = require('../models/Ambiente');
const usuarioRepository = require('../repositories/UsuarioRepository');
const ambienteRepository = require('../repositories/AmbienteRepository');

/**
 * Seed de datos iniciales
 */
function inicializarDatos() {
  // Limpiar datos anteriores
  usuarioRepository.limpiar();
  ambienteRepository.limpiar();

  // Crear usuarios de prueba
  const usuarios = [
    new Usuario('user-001', 'Juan Pérez', 'juan@universidad.edu', 'ESTUDIANTE', 'EST-001'),
    new Usuario('user-002', 'María González', 'maria@universidad.edu', 'ESTUDIANTE', 'EST-002'),
    new Usuario('user-003', 'Carlos Rodríguez', 'carlos@universidad.edu', 'ESTUDIANTE', 'EST-003'),
    new Usuario('user-jefe-001', 'Dr. Roberto López', 'roberto@universidad.edu', 'JEFE_AREA'),
    new Usuario('user-jefe-002', 'Ing. Patricia Sánchez', 'patricia@universidad.edu', 'JEFE_AREA'),
    new Usuario('user-admin-001', 'Admin Sistema', 'admin@universidad.edu', 'ADMIN')
  ];

  usuarios.forEach(usuario => usuarioRepository.crearUsuario(usuario));

  // Crear ambientes de prueba
  const ambientes = [
    new Ambiente(
      'lab-001',
      'Laboratorio de Informática A',
      'Edificio A - Piso 2',
      'LABORATORIO',
      30,
      ['Computadoras', 'Proyector', 'Aire Acondicionado', 'WiFi']
    ),
    new Ambiente(
      'lab-002',
      'Laboratorio de Electrónica',
      'Edificio B - Piso 1',
      'LABORATORIO',
      25,
      ['Osciloscopio', 'Multímetro', 'Fuentes de Poder', 'Aire Acondicionado']
    ),
    new Ambiente(
      'sal-001',
      'Salón de Clases 101',
      'Edificio A - Piso 1',
      'SALON',
      45,
      ['Pizarra', 'Proyector', 'Escritorio', 'Sillas']
    ),
    new Ambiente(
      'sal-002',
      'Salón de Clases 102',
      'Edificio A - Piso 1',
      'SALON',
      45,
      ['Pizarra', 'Proyector', 'Escritorio', 'Sillas']
    ),
    new Ambiente(
      'aud-001',
      'Auditorio Principal',
      'Edificio Central - Piso 0',
      'AUDITORIO',
      200,
      ['Proyector 4K', 'Sistema de Sonido', 'Micrófono', 'Escenario']
    ),
    new Ambiente(
      'sal-003',
      'Sala de Reuniones Executive',
      'Edificio Administrativo - Piso 3',
      'SALA_REUNIONES',
      12,
      ['Mesa Redonda', 'Proyector', 'Videoconferencia', 'Aire Acondicionado']
    )
  ];

  ambientes.forEach(ambiente => ambienteRepository.crearAmbiente(ambiente));

  console.log('✅ Datos iniciales cargados correctamente');
  console.log(`   - ${usuarios.length} usuarios creados`);
  console.log(`   - ${ambientes.length} ambientes creados`);

  return { usuarios, ambientes };
}

module.exports = {
  inicializarDatos
};
