# API Documentation - Campus 360

## Base URL
```
http://localhost:5000
```

## 📋 Tabla de Contenidos
- [Autenticación](#autenticación)
- [Ambientes](#ambientes)
- [Reservas](#reservas)
- [Bloqueos](#bloqueos)
- [Usuarios](#usuarios)
- [Códigos de Error](#códigos-de-error)

---

## 🔐 Autenticación

### Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "juan@universidad.edu",
  "password": "cualquiera"
}
```

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Login exitoso",
  "datos": {
    "token": "token_user-001_1707000000000",
    "usuario": {
      "id": "user-001",
      "nombre": "Juan Pérez",
      "email": "juan@universidad.edu",
      "rol": "ESTUDIANTE"
    }
  }
}
```

### Get Current User
**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "datos": {
    "id": "user-001",
    "nombre": "Juan Pérez",
    "email": "juan@universidad.edu",
    "rol": "ESTUDIANTE"
  }
}
```

---

## 🏛️ Ambientes

### List All Ambientes
**Endpoint:** `GET /ambientes`

**Query Parameters:**
- `tipo` (string) - Filtrar por tipo: LABORATORIO, SALON, AUDITORIO
- `capacidadMinima` (number) - Capacidad mínima requerida
- `estado` (string) - DISPONIBLE, EN_MANTENIMIENTO, INACTIVO
- `fechaInicio` (ISO date) - Para filtrar disponibilidad
- `fechaFin` (ISO date) - Para filtrar disponibilidad

**Example:**
```
GET /ambientes?tipo=LABORATORIO&capacidadMinima=20&fechaInicio=2025-02-10&fechaFin=2025-02-15
```

**Response (200):**
```json
{
  "success": true,
  "datos": [
    {
      "id": "lab-001",
      "nombre": "Laboratorio de Informática A",
      "ubicacion": "Edificio A - Piso 2",
      "tipo": "LABORATORIO",
      "capacidad": 30,
      "recursos": ["Computadoras", "Proyector", "Aire Acondicionado"],
      "estado": "DISPONIBLE",
      "fechaCreacion": "2025-02-09T10:00:00.000Z"
    }
  ]
}
```

### Get Ambiente by ID
**Endpoint:** `GET /ambientes/:id`

**Response (200):**
```json
{
  "success": true,
  "datos": {
    "id": "lab-001",
    "nombre": "Laboratorio de Informática A",
    "ubicacion": "Edificio A - Piso 2",
    "tipo": "LABORATORIO",
    "capacidad": 30,
    "recursos": ["Computadoras", "Proyector"],
    "estado": "DISPONIBLE"
  }
}
```

### Create Ambiente
**Endpoint:** `POST /ambientes`

**Required Role:** ADMIN

**Request:**
```json
{
  "id": "lab-new-001",
  "nombre": "Laboratorio de Química",
  "ubicacion": "Edificio C - Piso 3",
  "tipo": "LABORATORIO",
  "capacidad": 20,
  "recursos": ["Campana extractora", "Equipos de seguridad"]
}
```

**Response (201):**
```json
{
  "success": true,
  "mensaje": "Ambiente creado",
  "datos": { /* ambiente creado */ }
}
```

### Update Ambiente
**Endpoint:** `PUT /ambientes/:id`

**Required Role:** ADMIN

**Request:**
```json
{
  "nombre": "Laboratorio de Química Actualizado",
  "capacidad": 25
}
```

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Ambiente actualizado",
  "datos": { /* ambiente actualizado */ }
}
```

### Delete Ambiente
**Endpoint:** `DELETE /ambientes/:id`

**Required Role:** ADMIN

**Validaciones:**
- No debe tener reservas activas
- No debe tener bloqueos activos

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Ambiente eliminado"
}
```

---

## 📅 Reservas

### List Reservas
**Endpoint:** `GET /reservas`

**Query Parameters:**
- `estado` (string) - PENDIENTE, CONFIRMADA, RECHAZADA, CANCELADA

**Response:**
- **ESTUDIANTE**: Ve solo sus propias reservas
- **JEFE_AREA**: Ve todas las reservas
- **ADMIN**: Error 403 (sin permisos)

```json
{
  "success": true,
  "datos": [
    {
      "id": "res-001",
      "usuarioId": "user-001",
      "ambienteId": "lab-001",
      "fechaInicio": "2025-02-15T08:00:00Z",
      "fechaFin": "2025-02-15T10:00:00Z",
      "motivo": "Clase de laboratorio",
      "estado": "PENDIENTE",
      "motivoRechazo": null,
      "fechaCreacion": "2025-02-09T10:00:00Z",
      "fechaConfirmacion": null,
      "usuarioValidadorId": null
    }
  ]
}
```

### Create Reserva
**Endpoint:** `POST /reservas`

**Required Role:** ESTUDIANTE

**Validaciones:**
- RN01: Un estudiante solo puede tener una reserva activa
- RN02: No puede haber bloqueos en el período
- RN05: No puede haber reservas superpuestas
- RN06: Inicia en estado PENDIENTE

**Request:**
```json
{
  "ambienteId": "lab-001",
  "fechaInicio": "2025-02-15T08:00:00Z",
  "fechaFin": "2025-02-15T10:00:00Z",
  "motivo": "Clase de laboratorio"
}
```

**Response (201):**
```json
{
  "success": true,
  "mensaje": "Reserva creada",
  "datos": { /* reserva creada */ }
}
```

**Error (400):**
```json
{
  "success": false,
  "mensaje": "Ya tienes una reserva activa. Cancela la anterior antes de crear una nueva."
}
```

### Confirmar Reserva
**Endpoint:** `PUT /reservas/:id/confirmar`

**Required Role:** JEFE_AREA

**Request:** (vacío)

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Reserva confirmada",
  "datos": {
    /* reserva con estado CONFIRMADA */
  }
}
```

### Rechazar Reserva
**Endpoint:** `PUT /reservas/:id/rechazar`

**Required Role:** JEFE_AREA

**Request:**
```json
{
  "motivo": "Conflicto con evento del departamento"
}
```

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Reserva rechazada",
  "datos": {
    /* reserva con estado RECHAZADA */
  }
}
```

### Cancelar Reserva
**Endpoint:** `PUT /reservas/:id/cancelar`

**Required Role:** ESTUDIANTE (propietario)

**Validaciones:**
- RN03: Solo si faltan 24+ horas para la reserva

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Reserva cancelada",
  "datos": { /* reserva cancelada */ }
}
```

**Error (400):**
```json
{
  "success": false,
  "mensaje": "Solo puedes cancelar reservas con al menos 24 horas de anticipación"
}
```

---

## 🔒 Bloqueos de Mantenimiento

### List Bloqueos
**Endpoint:** `GET /bloqueos`

**Required Role:** ADMIN, JEFE_AREA

**Response (200):**
```json
{
  "success": true,
  "datos": [
    {
      "id": "blq-001",
      "ambienteId": "lab-001",
      "fechaInicio": "2025-02-20T00:00:00Z",
      "fechaFin": "2025-02-22T00:00:00Z",
      "descripcion": "Pintura de paredes",
      "creadoPor": "user-admin-001",
      "estado": "ACTIVO",
      "fechaCreacion": "2025-02-09T10:00:00Z"
    }
  ]
}
```

### Get Bloqueos por Ambiente
**Endpoint:** `GET /bloqueos/ambiente/:ambienteId`

**Response (200):**
```json
{
  "success": true,
  "datos": [ /* bloqueos del ambiente */ ]
}
```

### Create Bloqueo
**Endpoint:** `POST /bloqueos`

**Required Role:** ADMIN

**Validaciones:**
- Actualiza estado del ambiente a EN_MANTENIMIENTO

**Request:**
```json
{
  "ambienteId": "lab-001",
  "fechaInicio": "2025-02-20T00:00:00Z",
  "fechaFin": "2025-02-22T00:00:00Z",
  "descripcion": "Reparación eléctrica"
}
```

**Response (201):**
```json
{
  "success": true,
  "mensaje": "Bloqueo creado",
  "datos": { /* bloqueo creado */ }
}
```

### Delete Bloqueo
**Endpoint:** `DELETE /bloqueos/:id`

**Required Role:** ADMIN

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Bloqueo eliminado"
}
```

---

## 👥 Usuarios

### List Usuarios
**Endpoint:** `GET /usuarios`

**Required Role:** ADMIN

**Response (200):**
```json
{
  "success": true,
  "datos": [
    {
      "id": "user-001",
      "nombre": "Juan Pérez",
      "email": "juan@universidad.edu",
      "rol": "ESTUDIANTE",
      "activo": true
    }
  ]
}
```

### Get Usuario by ID
**Endpoint:** `GET /usuarios/:id`

**Rules:**
- ADMIN puede ver cualquier usuario
- ESTUDIANTE solo puede ver su perfil

**Response (200):**
```json
{
  "success": true,
  "datos": { /* usuario */ }
}
```

### Get Notificaciones
**Endpoint:** `GET /usuarios/:id/notificaciones`

**Response (200):**
```json
{
  "success": true,
  "datos": [
    {
      "id": "notif-001",
      "usuarioId": "user-001",
      "tipo": "RESERVA_CONFIRMADA",
      "titulo": "Reserva confirmada",
      "mensaje": "Tu reserva para Lab A ha sido confirmada",
      "relatedReservaId": "res-001",
      "leida": false,
      "fechaCreacion": "2025-02-09T10:30:00Z"
    }
  ]
}
```

### Get Notificaciones No Leídas
**Endpoint:** `GET /usuarios/:id/notificaciones/no-leidas`

**Response (200):**
```json
{
  "success": true,
  "datos": [ /* notificaciones no leídas */ ]
}
```

### Marcar Notificación como Leída
**Endpoint:** `PUT /usuarios/:id/notificaciones/:notificacionId/leer`

**Response (200):**
```json
{
  "success": true,
  "mensaje": "Notificación marcada como leída"
}
```

---

## 🔴 Códigos de Error

### 200 OK
Operación exitosa

### 201 Created
Recurso creado exitosamente

### 400 Bad Request
- Datos incompletos
- Validación fallida
- Conflicto de negocio

**Example:**
```json
{
  "success": false,
  "mensaje": "Ya existe una reserva en ese horario",
  "detalles": null
}
```

### 401 Unauthorized
- Token no proporcionado
- Token inválido o expirado

**Example:**
```json
{
  "success": false,
  "mensaje": "Token inválido o expirado"
}
```

### 403 Forbidden
- Rol insuficiente para la operación

**Example:**
```json
{
  "success": false,
  "mensaje": "No tienes permisos para acceder a este recurso"
}
```

### 404 Not Found
- Recurso no encontrado

**Example:**
```json
{
  "success": false,
  "mensaje": "Ambiente no encontrado"
}
```

### 500 Internal Server Error
- Error del servidor

---

## 📊 Estados de Reserva

```
PENDIENTE → CONFIRMADA → [Activa hasta fechaFin]
         ↘ RECHAZADA   → [Finalizada]
         ↘ CANCELADA   → [Finalizada]
```

## 📊 Estados de Ambiente

```
DISPONIBLE ← [Inicial]
         ↓ [Crear bloqueo]
EN_MANTENIMIENTO
         ↓ [Eliminar bloqueos]
DISPONIBLE
         ↓ [Admin]
INACTIVO
```

## 🔑 Roles y Permisos

| Operación | ESTUDIANTE | JEFE_AREA | ADMIN |
|-----------|:----------:|:---------:|:-----:|
| Ver ambientes | ✅ | ✅ | ✅ |
| Crear reserva | ✅ | ❌ | ❌ |
| Cancelar propia reserva | ✅ | ❌ | ❌ |
| Ver propias reservas | ✅ | ❌ | ❌ |
| Ver todas las reservas | ❌ | ✅ | ❌ |
| Confirmar reserva | ❌ | ✅ | ❌ |
| Rechazar reserva | ❌ | ✅ | ❌ |
| Crear ambiente | ❌ | ❌ | ✅ |
| Eliminar ambiente | ❌ | ❌ | ✅ |
| Crear bloqueo | ❌ | ❌ | ✅ |
| Ver usuarios | ❌ | ❌ | ✅ |

---

## 🧪 Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@universidad.edu","password":"demo"}'
```

### Listar Ambientes
```bash
curl http://localhost:5000/ambientes \
  -H "Authorization: Bearer TOKEN"
```

### Crear Reserva
```bash
curl -X POST http://localhost:5000/reservas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "ambienteId":"lab-001",
    "fechaInicio":"2025-02-15T08:00:00Z",
    "fechaFin":"2025-02-15T10:00:00Z",
    "motivo":"Clase de laboratorio"
  }'
```

### Confirmar Reserva (como Jefe de Área)
```bash
curl -X PUT http://localhost:5000/reservas/RES_ID/confirmar \
  -H "Authorization: Bearer TOKEN"
```

---

**Última actualización:** Febrero 9, 2025
