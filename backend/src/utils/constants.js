/**
 * Constantes compartidas (roles, estados, tipos)
 */
const ROLES = {
  ADMIN: 'ADMIN',
  JEFE_AREA: 'JEFE_AREA',
  ESTUDIANTE: 'ESTUDIANTE'
};

const ESTADOS = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  RECHAZADA: 'RECHAZADA',
  CANCELADA: 'CANCELADA'
};

module.exports = { ROLES, ESTADOS };
