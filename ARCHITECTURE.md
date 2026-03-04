# Arquitectura del Sistema - Campus 360

## 🏗️ Visión General

```
┌─────────────────────────────────────────────────────────────┐
│                     NAVEGADOR DEL USUARIO                    │
│                     (React + Tailwind CSS)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    HTTP REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  EXPRESS.JS SERVER                           │
│              (Node.js - Puerto 5000)                         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            CAPA DE RUTAS (Routes)                    │   │
│  │  ┌─────────────────┐  ┌────────────────────────┐    │   │
│  │  │ autenticacion   │  │ ambientes              │    │   │
│  │  └─────────────────┘  │ reservas               │    │   │
│  │                       │ bloqueos               │    │   │
│  │                       │ usuarios               │    │   │
│  │                       └────────────────────────┘    │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────▼──────────────────────────────────────┐   │
│  │        CAPA DE SERVICIOS (Business Logic)            │   │
│  │  ┌─────────────────┐  ┌────────────────────────┐    │   │
│  │  │ AmbienteService │  │ ReservaService         │    │   │
│  │  │ (CRUD)          │  │ (RN01-RN10)            │    │   │
│  │  └─────────────────┘  │                        │    │   │
│  │  ┌─────────────────┐  │ BloqueoService         │    │   │
│  │  │ UsuarioService  │  │ (Prioridad)            │    │   │
│  │  └─────────────────┘  └────────────────────────┘    │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────▼──────────────────────────────────────┐   │
│  │      CAPA DE REPOSITORIES (Acceso a Datos)          │   │
│  │           EN MEMORIA (Singleton Pattern)             │   │
│  │  ┌──────────────────┐  ┌─────────────────────────┐  │   │
│  │  │UsuarioRepository │  │AmbienteRepository      │  │   │
│  │  │[usuarios:Array]  │  │[ambientes:Array]       │  │   │
│  │  └──────────────────┘  └─────────────────────────┘  │   │
│  │  ┌──────────────────┐  ┌─────────────────────────┐  │   │
│  │  │ReservaRepository │  │BloqueoRepository        │  │   │
│  │  │[reservas:Array]  │  │[bloqueos:Array]         │  │   │
│  │  └──────────────────┘  └─────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │    NotificacionRepository                     │   │   │
│  │  │    [notificaciones:Array]                     │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         CAPA DE MODELOS (Domain Models)              │   │
│  │  Usuario | Ambiente | Reserva | Bloqueo | Notif    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      MIDDLEWARE & UTILIDADES                        │   │
│  │  autenticacion.js | respuestas.js | seed.js        │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de una Reserva

```
┌─────────────────────────────────────────────────────────────┐
│  ESTUDIANTE INICIA RESERVA EN FRONTEND                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │  POST /reservas (con datos)            │
        │  Header: Authorization: Bearer TOKEN   │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────────────┐
        │  MIDDLEWARE: autenticar()                      │
        │  ✓ Verifica token                             │
        │  ✓ Obtiene usuario                            │
        │  ✓ Verifica rol = ESTUDIANTE                  │
        └────────────────┬───────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────────────┐
        │  ROUTE: POST /reservas                         │
        │  ✓ Parsea datos                               │
        │  ✓ Llama ReservaService.crearReserva()        │
        └────────────────┬───────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────────────┐
        │  ReservaService.crearReserva()                 │
        │                                                │
        │  1. Validar usuario existe                    │
        │  2. Validar ambiente existe                   │
        │  3. RN02: Verificar bloqueos                  │
        │  4. RN05: Verificar conflictos horarios       │
        │  5. RN01: Verificar no tiene reserva activa   │
        │  6. Validar fechas válidas                    │
        │  7. RN06: Crear en estado PENDIENTE           │
        │  8. RN10: Generar notificación                │
        │  9. Retornar reserva creada                   │
        └────────────────┬───────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────────────┐
        │  ReservaRepository.crearReserva()              │
        │  - Agrega a array reservas[]                  │
        │  - Retorna reserva creada                     │
        └────────────────┬───────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────────────┐
        │  NotificacionRepository.crearNotificacion()    │
        │  - Agrega notificación a estudiante            │
        └────────────────┬───────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────────────┐
        │  Response 201 CREATED                          │
        │  {                                             │
        │    "success": true,                            │
        │    "datos": {reserva}                          │
        │  }                                             │
        └────────────────┬───────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────────────┐
        │  FRONTEND RECIBE RESPUESTA                     │
        │  - Actualiza estado                           │
        │  - Muestra notificación de éxito               │
        │  - Redirige a "Mis Reservas"                  │
        └─────────────────────────────────────────────────┘
```

---

## 🔐 Flujo de Autenticación

```
┌──────────────────────────────┐
│  Usuario ingresa email en    │
│  pantalla de login           │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────────────────────────────┐
        │ POST /auth/login                │
        │ {email: "juan@..."}             │
        └────────┬────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────┐
        │ UsuarioService.obtenerPorEmail()│
        │ - Busca en UsuarioRepository    │
        │ - Retorna usuario o error       │
        └────────┬────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────────┐
        │ autenticacion.generarToken()            │
        │ - Crea token simulado                   │
        │ - Almacena en Map global tokensActivos  │
        │ - Retorna token                         │
        └────────┬────────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ Response 200:                       │
        │ {                                   │
        │   token: "token_user-001_12345",   │
        │   usuario: {...}                    │
        │ }                                   │
        └────────┬────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ Frontend almacena en localStorage   │
        │ - token                             │
        │ - usuario                           │
        └────────┬────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ Siguientes peticiones:              │
        │ Header: Authorization: Bearer TOKEN │
        └─────────────────────────────────────┘
```

---

## 📊 Diagrama de Datos

### Usuarios (En Memoria)
```javascript
usuarios = [
  {
    id: "user-001",
    nombre: "Juan Pérez",
    email: "juan@universidad.edu",
    rol: "ESTUDIANTE",
    codigoEstudiante: "EST-001",
    activo: true,
    fechaCreacion: Date
  }
]
```

### Ambientes (En Memoria)
```javascript
ambientes = [
  {
    id: "lab-001",
    nombre: "Laboratorio de Informática A",
    ubicacion: "Edificio A - Piso 2",
    tipo: "LABORATORIO",
    capacidad: 30,
    recursos: ["Computadoras", "Proyector"],
    estado: "DISPONIBLE",
    fechaCreacion: Date
  }
]
```

### Reservas (En Memoria)
```javascript
reservas = [
  {
    id: "res-001",
    usuarioId: "user-001",
    ambienteId: "lab-001",
    fechaInicio: Date,
    fechaFin: Date,
    motivo: "Clase de laboratorio",
    estado: "PENDIENTE", // → CONFIRMADA/RECHAZADA/CANCELADA
    motivoRechazo: null,
    fechaCreacion: Date,
    fechaConfirmacion: null,
    usuarioValidadorId: null
  }
]
```

### Bloqueos (En Memoria)
```javascript
bloqueos = [
  {
    id: "blq-001",
    ambienteId: "lab-001",
    fechaInicio: Date,
    fechaFin: Date,
    descripcion: "Pintura de paredes",
    creadoPor: "user-admin-001",
    estado: "ACTIVO", // → COMPLETADO
    fechaCreacion: Date
  }
]
```

---

## 🎯 Patrones de Diseño Utilizados

### 1. Singleton Pattern (Repositories)
```javascript
class UsuarioRepository {
  constructor() {
    this.usuarios = [];
  }
}
module.exports = new UsuarioRepository(); // Instancia única
```

**Ventaja:** Una sola instancia compartida en toda la aplicación

### 2. Service Layer Pattern
```javascript
// Routes → Services → Repositories
router.post('/reservas', (req, res) => {
  const reserva = reservaService.crearReserva(...);
  // Services manejan toda la lógica
});
```

**Ventaja:** Separación clara de responsabilidades

### 3. Data Transfer Object (DTO)
```javascript
// Respuestas consistentes
{
  success: boolean,
  mensaje: string,
  datos: any,
  detalles?: any
}
```

**Ventaja:** API predecible y fácil de consumir

### 4. Middleware Chain
```javascript
app.use(cors());
app.use(express.json());
app.use(autenticar); // Ejecuta middleware en orden
```

**Ventaja:** Separación de concerns

---

## 🔑 Decisiones Arquitectónicas

### 1. ¿Por qué almacenamiento en memoria?
✓ Rápido y simple para prototipo
✓ Sin dependencias externas (BD)
✓ Fácil de testear
✓ Datos se limpian automáticamente

### 2. ¿Por qué repositories?
✓ Desacopla servicios de la fuente de datos
✓ Fácil cambiar a BD real después
✓ Métodos CRUD estandarizados

### 3. ¿Por qué services?
✓ Lógica de negocio centralizada
✓ Reutilizable entre rutas
✓ Fácil de testear
✓ Implementación de RN en un lugar

### 4. ¿Por qué validación atómica?
✓ Evita race conditions
✓ Impide dobles reservas
✓ Mantiene consistencia de datos

---

## 📈 Escalabilidad Futura

### Para agregar Base de Datos Real:
```javascript
// Cambiar Repository
// Antes: En memoria
class UsuarioRepository {
  crearUsuario(usuario) {
    this.usuarios.push(usuario);
  }
}

// Después: Base de datos
class UsuarioRepository {
  async crearUsuario(usuario) {
    return await db.usuarios.insert(usuario);
  }
}

// Services no necesitan cambios
// La API tampoco necesita cambios
```

### Agregar Autenticación Real:
```javascript
// Cambiar middleware
// Antes: Token simulado
// Después: JWT real con secret

function generarToken(usuario) {
  return jwt.sign({id: usuario.id}, process.env.JWT_SECRET);
}
```

### Agregar Caché:
```javascript
// Agregar Redis
redis.get('ambientes', () => {
  return ambienteRepository.obtenerTodos();
});
```

---

## 🧪 Testing

### Unit Test (Ejemplo)
```javascript
describe('ReservaService', () => {
  test('RN01: No permite dos reservas activas', () => {
    const usuario = { id: 'user-001', rol: 'ESTUDIANTE' };
    reservaService.crearReserva(usuario.id, ...);
    
    expect(() => {
      reservaService.crearReserva(usuario.id, ...);
    }).toThrow('Ya tienes una reserva activa');
  });
});
```

### Integration Test (Ejemplo)
```javascript
test('Flujo completo: crear y confirmar reserva', async () => {
  // 1. Login estudiante
  const token = await API.login('juan@...');
  
  // 2. Crear reserva
  const reserva = await API.crearReserva(token, {...});
  expect(reserva.estado).toBe('PENDIENTE');
  
  // 3. Login jefe área
  const tokenJefe = await API.login('roberto@...');
  
  // 4. Confirmar
  await API.confirmarReserva(tokenJefe, reserva.id);
  
  // 5. Verificar
  const reservaActualizada = await API.getReserva(token, reserva.id);
  expect(reservaActualizada.estado).toBe('CONFIRMADA');
});
```

---

## 📊 Performance

### Complejidad Temporal
- **GET /ambientes** - O(n) - Itera Array
- **POST /reservas** - O(n) - Valida conflictos
- **GET /reservas/:id** - O(n) - Busca en Array

### Optimizaciones (Futuro)
- Agregar índices en BD
- Caché de consultas frecuentes
- Búsqueda binaria en rangos de fechas
- Paginación de resultados

---

## 🔒 Seguridad

### Validaciones Implementadas
1. ✅ Verificación de token en cada request
2. ✅ Validación de roles
3. ✅ Validación de propiedad (estudiante solo ve sus reservas)
4. ✅ Sanitización de entrada (validación básica)
5. ✅ Errores genéricos (no revelar detalles internos)

### Para Producción (TODO)
- [ ] Usar JWT real con secret
- [ ] HTTPS/TLS
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] SQL injection prevention (si usa BD)
- [ ] XSS protection
- [ ] Input validation más estricta

---

**Documento de Arquitectura - Campus 360**  
*Última actualización: Febrero 9, 2025*
