/**
 * Servidor Principal - Campus 360: Módulo de Reserva de Ambientes
 * Backend API REST con Node.js + Express
 */

const express = require('express');
const cors = require('cors');
const { autenticar } = require('./middleware/autenticacion');
const { manejadorErrores } = require('./utils/respuestas');
const { inicializarDatos } = require('./utils/seed');

// Importar rutas
const rutasAutenticacion = require('./routes/autenticacion');
const rutasAmbientes = require('./routes/ambientes');
const rutasReservas = require('./routes/reservas');
const rutasBloqueos = require('./routes/bloqueos');
const rutasUsuarios = require('./routes/usuarios');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE GLOBAL
// ============================================

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
const logger = require('./utils/logger');
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ============================================
// INICIALIZAR DATOS
// ============================================

inicializarDatos();

// ============================================
// RUTAS
// ============================================

// Salud del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Campus 360 - Reserva de Ambientes'
  });
});

// Rutas de autenticación (sin autenticación)
app.use('/auth', rutasAutenticacion);

// Rutas protegidas
app.use('/ambientes', autenticar, rutasAmbientes);
app.use('/reservas', autenticar, rutasReservas);
app.use('/bloqueos', autenticar, rutasBloqueos);
app.use('/usuarios', autenticar, rutasUsuarios);

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use(manejadorErrores);

// 404 - No encontrado
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const server = app.listen(PORT, () => {
  logger.info('╔════════════════════════════════════════════════════════╗');
  logger.info('║   Campus 360 - Módulo de Reserva de Ambientes         ║');
  logger.info('║   Backend API REST                                     ║');
  logger.info('╚════════════════════════════════════════════════════════╝');
  logger.info(`Servidor ejecutándose en http://localhost:${PORT}`);
  logger.info(`API Documentation disponible en http://localhost:${PORT}/docs`);
  logger.info('Usuarios de prueba: Estudiante: juan@universidad.edu, Jefe de Área: roberto@universidad.edu, Admin: admin@universidad.edu');
  logger.info('Todos los usuarios usan password: cualquiera (simulado)');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  logger.error('Error no manejado:', err);
});

process.on('SIGINT', () => {
  logger.info('\n\nServidor detenido');
  process.exit(0);
});

module.exports = app;
