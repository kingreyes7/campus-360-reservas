# Campus 360 - Módulo de Reserva de Ambientes

Sistema web completamente funcional para la gestión y reserva de ambientes universitarios.

## 🎯 Características Principales

✅ **Autenticación simulada** con 3 roles (Estudiante, Jefe de Área, Admin)  
✅ **Búsqueda de ambientes** con filtros avanzados  
✅ **Gestión de reservas** con validación de conflictos horarios  
✅ **Bloqueos de mantenimiento** con prioridad sobre reservas  
✅ **Sistema de notificaciones** en tiempo real  
✅ **Almacenamiento en memoria** sin dependencias externas  
✅ **Arquitectura en capas** con separación clara de responsabilidades  
✅ **Interfaz moderna y responsiva** con Tailwind CSS  

## 📋 Reglas de Negocio Implementadas

- **RN01**: Un estudiante solo puede tener una reserva activa
- **RN02**: Bloqueos por mantenimiento tienen prioridad
- **RN03**: Cancelación solo permitida hasta 24h antes
- **RN04**: Toda reserva debe ser validada por el Jefe de Área
- **RN05**: No pueden existir reservas superpuestas
- **RN06**: Toda reserva inicia en estado PENDIENTE
- **RN07**: No se puede eliminar un ambiente con reservas o bloqueos
- **RN08**: Modificar ambientes no afecta reservas confirmadas
- **RN09**: Estudiantes solo ven sus propias reservas
- **RN10**: Toda acción genera notificación al estudiante

## 🚀 Inicio Rápido

### Requisitos
- Node.js v14+ 
- npm o yarn

### Instalación

#### 1. Backend (Terminal 1)

```bash
cd backend
npm install
npm start
```

El servidor estará disponible en `http://localhost:5000`

#### 2. Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Estudiante | juan@universidad.edu | cualquiera |
| Jefe de Área | roberto@universidad.edu | cualquiera |
| Admin | admin@universidad.edu | cualquiera |

## 🏗️ Estructura del Proyecto

```
campus-360-reservas/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Servidor principal
│   │   ├── models/                  # Modelos de dominio
│   │   │   ├── Usuario.js
│   │   │   ├── Ambiente.js
│   │   │   ├── Reserva.js
│   │   │   ├── BloqueoMantenimiento.js
│   │   │   └── Notificacion.js
│   │   ├── repositories/            # Acceso a datos (en memoria)
│   │   │   ├── UsuarioRepository.js
│   │   │   ├── AmbienteRepository.js
│   │   │   ├── ReservaRepository.js
│   │   │   ├── BloqueoMantenimientoRepository.js
│   │   │   └── NotificacionRepository.js
│   │   ├── services/                # Lógica de negocio
│   │   │   ├── UsuarioService.js
│   │   │   ├── AmbienteService.js
│   │   │   ├── ReservaService.js
│   │   │   └── BloqueoMantenimientoService.js
│   │   ├── routes/                  # Endpoints API
│   │   │   ├── autenticacion.js
│   │   │   ├── ambientes.js
│   │   │   ├── reservas.js
│   │   │   ├── bloqueos.js
│   │   │   └── usuarios.js
│   │   ├── middleware/              # Autenticación
│   │   │   └── autenticacion.js
│   │   └── utils/                   # Utilidades
│   │       ├── respuestas.js
│   │       └── seed.js
│   ├── package.json
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── index.jsx                # Punto de entrada
    │   ├── App.jsx                  # Componente principal
    │   ├── components/              # Componentes reutilizables
    │   │   ├── Navbar.jsx
    │   │   ├── Card.jsx
    │   │   ├── Button.jsx
    │   │   ├── Alert.jsx
    │   │   ├── Modal.jsx
    │   │   └── FormGroup.jsx
    │   ├── pages/                   # Páginas por rol
    │   │   ├── LoginPage.jsx
    │   │   ├── EstudianteDashboard.jsx
    │   │   ├── JefeAreaDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── estudiante/
    │   │       ├── BuscarAmbientes.jsx
    │   │       └── MisReservas.jsx
    │   └── services/
    │       └── api.js               # Cliente API
    ├── index.html
    ├── package.json
    └── .gitignore
```

## 🔌 API REST Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Datos del usuario actual

### Ambientes
- `GET /ambientes` - Listar ambientes con filtros
- `GET /ambientes/:id` - Obtener ambiente
- `POST /ambientes` - Crear ambiente (ADMIN)
- `PUT /ambientes/:id` - Actualizar ambiente (ADMIN)
- `DELETE /ambientes/:id` - Eliminar ambiente (ADMIN)

### Reservas
- `GET /reservas` - Listar reservas
- `POST /reservas` - Crear reserva (ESTUDIANTE)
- `PUT /reservas/:id/confirmar` - Confirmar (JEFE_AREA)
- `PUT /reservas/:id/rechazar` - Rechazar (JEFE_AREA)
- `PUT /reservas/:id/cancelar` - Cancelar (ESTUDIANTE)

### Bloqueos
- `GET /bloqueos` - Listar bloqueos
- `POST /bloqueos` - Crear bloqueo (ADMIN)
- `DELETE /bloqueos/:id` - Eliminar bloqueo (ADMIN)

### Usuarios
- `GET /usuarios` - Listar usuarios (ADMIN)
- `GET /usuarios/:id/notificaciones` - Notificaciones
- `PUT /usuarios/:id/notificaciones/:notId/leer` - Marcar como leída

## 🎨 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Control de acceso
- **UUID** - Generación de IDs únicos

### Frontend
- **React** - Librería UI
- **React Router** - Enrutamiento
- **CSS3** - Estilos modulares
- **Fetch API** - Comunicación HTTP

## 💾 Almacenamiento de Datos

Todos los datos se almacenan **en memoria** utilizando:
- Arrays para listas
- Objetos para mapeos
- Repositorios singleton para persistencia en sesión

Los datos se **pierden al reiniciar** el servidor (comportamiento esperado para prototipo).

## 🔐 Seguridad

- **Autenticación simulada** con tokens JWT básicos
- **Validación de roles** en endpoints
- **Validación de permisos** en servicios
- **Validaciones atómicas** para evitar dobles reservas

## 📱 Responsive Design

- ✅ Escritorio (>1024px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (<768px)

## 🧪 Casos de Uso Demostrados

### Estudiante
1. ✅ Buscar ambientes con filtros
2. ✅ Crear reserva (PENDIENTE)
3. ✅ Ver historial de reservas
4. ✅ Cancelar reserva (24h antes)
5. ✅ Recibir notificaciones

### Jefe de Área
1. ✅ Ver reservas pendientes
2. ✅ Confirmar o rechazar reservas
3. ✅ Enviar motivo de rechazo
4. ✅ Ver todas las reservas

### Admin
1. ✅ Crear ambientes
2. ✅ Eliminar ambientes
3. ✅ Crear bloqueos de mantenimiento
4. ✅ Gestionar catálogo completo
5. ✅ Ver usuarios del sistema

## 🔍 Testing Manual

### Flujo 1: Crear y Confirmar Reserva
1. Login como ESTUDIANTE (juan@universidad.edu)
2. Ir a "Buscar Ambientes"
3. Seleccionar fechas y ambiente
4. Crear reserva
5. Login como JEFE_AREA (roberto@universidad.edu)
6. Ver "Reservas Pendientes"
7. Confirmar o rechazar

### Flujo 2: Bloqueo de Mantenimiento
1. Login como ADMIN
2. Ir a "Bloqueos"
3. Crear bloqueo para un ambiente
4. Login como ESTUDIANTE
5. Verificar que el ambiente aparece como NO DISPONIBLE en ese período

### Flujo 3: Validación de Conflictos
1. Crear reserva para sala en fecha X, horario 8-10
2. Intentar crear otra reserva del mismo estudiante en X, horario 9-11
3. Validar que sea rechazada por conflicto

## 📝 Datos Iniciales Seed

El sistema se inicializa con:
- **6 usuarios** (3 estudiantes, 2 jefes de área, 1 admin)
- **6 ambientes** (laboratorios, salones, auditorio)
- **0 reservas** (se crean durante la sesión)
- **0 bloqueos** (se crean durante la sesión)

## ⚙️ Variables de Entorno

Backend: Por defecto en puerto 5000
```
PORT=5000
```

Frontend: Por defecto en puerto 3000
```
VITE_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

**Backend no inicia**
```bash
# Verificar que Node.js está instalado
node --version

# Instalar dependencias
npm install

# Iniciar en modo debug
NODE_DEBUG=* npm start
```

**Frontend no conecta con backend**
```bash
# Verificar que backend está corriendo en puerto 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Verificar CORS en http://localhost:5000/health
```

**Datos no persisten**
Es comportamiento esperado - los datos están en memoria. Reinicia el servidor para resetear.

## 📚 Documentación Adicional

### Arquitectura en Capas

```
┌─────────────────────────────┐
│      Presentación           │
│    (Frontend - React)       │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│    Lógica de Negocio        │
│      (Services)             │
│  - AmbienteService          │
│  - ReservaService           │
│  - BloqueoService           │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│    Acceso a Datos           │
│    (Repositories)           │
│  - En memoria (arrays)      │
│  - Singleton pattern        │
└─────────────────────────────┘
```

### Flujo de Validación de Reserva

```
1. Validar usuario
   ↓
2. Validar ambiente existe
   ↓
3. Verificar bloqueos (RN02) ← Prioridad máxima
   ↓
4. Verificar conflictos horarios (RN05)
   ↓
5. Validar una reserva activa por estudiante (RN01)
   ↓
6. Validar fechas válidas (RN06)
   ↓
7. Crear en estado PENDIENTE
   ↓
8. Generar notificación (RN10)
```

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 👨‍💼 Autor

Proyecto desarrollado como demostración de Sistema de Reserva de Ambientes Universitarios - Campus 360.

---

**¡Listo para usar!** Sigue las instrucciones de inicio rápido arriba.
