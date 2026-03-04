# ⚡ Guía de Ejecución Rápida

## 🎯 Objetivo
Ejecutar completamente el sistema **Campus 360 - Módulo de Reserva de Ambientes**

---

## 🚀 Paso 1: Preparación

### Requisitos previos
- ✅ Node.js v14 o superior
- ✅ npm (incluido con Node.js)
- ✅ 2 terminales disponibles
- ✅ Navegador web moderno

### Verificar instalación
```bash
node --version    # Debe ser v14+
npm --version     # Debe ser v6+
```

---

## 📦 Paso 2: Instalación de Dependencias

### Terminal 1: Backend
```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Resultado esperado:
# ✓ express
# ✓ cors
# ✓ uuid
# Packages installed successfully
```

### Terminal 2: Frontend
```bash
# En otra terminal, navegar al frontend
cd frontend

# Instalar dependencias
npm install

# Resultado esperado:
# ✓ react
# ✓ react-dom
# ✓ react-router-dom
# ✓ axios
# Packages installed successfully
```

---

## ▶️ Paso 3: Iniciar el Backend

### En Terminal 1:
```bash
cd backend
npm start
```

### Resultado esperado:
```
╔════════════════════════════════════════════════════════╗
║   Campus 360 - Módulo de Reserva de Ambientes         ║
║   Backend API REST                                     ║
╚════════════════════════════════════════════════════════╝

✅ Servidor ejecutándose en http://localhost:5000
📚 API Documentation disponible en http://localhost:5000/docs

Usuarios de prueba:
  - Estudiante: juan@universidad.edu
  - Jefe de Área: roberto@universidad.edu
  - Admin: admin@universidad.edu

Todos los usuarios usan password: cualquiera (simulado)

✓ Datos iniciales cargados correctamente
   - 6 usuarios creados
   - 6 ambientes creados
```

⏸️ **IMPORTANTE**: Dejar esta terminal abierta y corriendo

---

## ▶️ Paso 4: Iniciar el Frontend

### En Terminal 2:
```bash
cd frontend
npm start
```

### Resultado esperado:
```
Webpack Dev Server is listening on:
  http://localhost:3000

Compiled successfully!

The app is running at:
  http://localhost:3000
```

Automáticamente se abrirá el navegador en http://localhost:3000

---

## 🎮 Paso 5: Pruebas Iniciales

### 5.1 Verificar Backend
```bash
# En otro navegador o terminal
curl http://localhost:5000/health

# Respuesta esperada:
# {
#   "status": "OK",
#   "timestamp": "2025-02-09T10:00:00.000Z",
#   "service": "Campus 360 - Reserva de Ambientes"
# }
```

### 5.2 Login en Frontend
1. Esperar a que http://localhost:3000 se cargue
2. Ver la pantalla de LOGIN
3. Click en **"Juan Pérez (Estudiante)"** para login rápido
4. Debe entrar al dashboard de estudiante

---

## 🧪 Paso 6: Pruebas Funcionales

### Flujo 1: Crear Reserva (Estudiante)
```
1. ✓ Login como juan@universidad.edu
2. ✓ Click en "Buscar Ambientes"
3. ✓ Seleccionar:
   - Fecha inicio: mañana
   - Fecha fin: mañana
   - Tipo: LABORATORIO
4. ✓ Click en "Reservar" en algún laboratorio
5. ✓ Completar motivo: "Clase de laboratorio"
6. ✓ Click en "Reservar"
7. ✓ Ver mensaje: "Reserva creada exitosamente"
```

### Flujo 2: Validar Reserva (Jefe de Área)
```
1. ✓ Logout (esquina superior)
2. ✓ Login como roberto@universidad.edu
3. ✓ Ver "Pendientes" con badge
4. ✓ Click en "Confirmar"
5. ✓ Ver cambio a estado CONFIRMADA
```

### Flujo 3: Crear Bloqueo (Admin)
```
1. ✓ Logout
2. ✓ Login como admin@universidad.edu
3. ✓ Click en "Bloqueos"
4. ✓ Click en "Crear Bloqueo"
5. ✓ Seleccionar ambiente, fechas, descripción
6. ✓ Ver que el ambiente ahora está EN_MANTENIMIENTO
```

---

## 📊 Validaciones del Sistema

Todas estas RN deben validarse:

### RN01: Una reserva activa por estudiante
```
❌ Estudiante intenta crear 2 reservas simultáneas
→ Error: "Ya tienes una reserva activa"
```

### RN02: Bloqueos tienen prioridad
```
✓ Crear bloqueo en Lab A (Feb 15-20)
❌ Intenta reservar Lab A para Feb 17
→ Error: "El ambiente está bloqueado"
```

### RN03: Cancelación 24h antes
```
✓ Reserva confirmada para mañana
❌ Intenta cancelar
→ Error: "Solo puedes cancelar con 24h de anticipación"
```

### RN05: No hay superpuestas
```
✓ Reserva Lab A 8-10
❌ Intenta Lab A 9-11
→ Error: "Ya existe una reserva en ese horario"
```

---

## 🔧 Troubleshooting

### Puerto 5000 en uso
```bash
# Buscar qué ocupa el puerto
# Windows:
netstat -ano | findstr :5000

# macOS/Linux:
lsof -i :5000

# Matar el proceso:
# Windows:
taskkill /PID <PID> /F

# macOS/Linux:
kill -9 <PID>
```

### Puerto 3000 en uso
```bash
# Similar al anterior pero con puerto 3000
```

### Backend no responde desde Frontend
```bash
1. ✓ Verificar que backend está corriendo (http://localhost:5000/health)
2. ✓ Verificar CORS en backend (debería incluir localhost:3000)
3. ✓ Limpiar cache del navegador (Ctrl+Shift+Del)
4. ✓ Reiniciar ambos servidores
```

### Datos perdidos (comportamiento normal)
```
⚠️ Los datos se guardan EN MEMORIA
✓ Reiniciar backend para resetear
✓ Los datos de demo se cargan automáticamente
```

---

## 📱 URLs Importantes

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/health |
| Login Página | http://localhost:3000/login |

---

## 👥 Usuarios Disponibles

| Rol | Email | Contraseña | Acceso |
|-----|-------|-----------|--------|
| **Estudiante** | juan@universidad.edu | cualquiera | Buscar, Reservar, Cancelar |
| **Jefe de Área** | roberto@universidad.edu | cualquiera | Validar reservas |
| **Admin** | admin@universidad.edu | cualquiera | CRUD Ambientes, Bloqueos |

---

## ⌨️ Atajos de Terminal

### Detener Backend
```bash
# En la terminal del backend
Ctrl + C
```

### Detener Frontend
```bash
# En la terminal del frontend
Ctrl + C
```

### Reiniciar Backend (preservar código)
```bash
# Terminal Backend
npm start
```

---

## 📝 Logs Útiles

### Backend
```
✅ Servidor ejecutándose
📚 Ambientes cargados: 6
✓ Usuarios listos: 6
⏳ Esperando peticiones...
```

### Frontend
```
Compiled successfully!
The app is running at http://localhost:3000
🔄 API conectado a http://localhost:5000
```

---

## 🎯 Demostración en Vivo

### Duración: ~15 minutos

1. **Setup** (2 min)
   - Iniciar backend
   - Iniciar frontend

2. **Demostración Estudiante** (4 min)
   - Login
   - Buscar ambientes
   - Crear reserva
   - Ver notificaciones

3. **Demostración Jefe de Área** (3 min)
   - Login diferente
   - Ver pendientes
   - Confirmar/rechazar

4. **Demostración Admin** (3 min)
   - Login admin
   - Crear ambiente
   - Crear bloqueo
   - Verificar validaciones

5. **Validación de Reglas** (3 min)
   - Intentar doble reserva
   - Intentar cancelar sin 24h
   - Intentar reservar bloqueado

---

## ✅ Checklist Final

- [ ] Node.js y npm instalados
- [ ] Backend en http://localhost:5000 ✓
- [ ] Frontend en http://localhost:3000 ✓
- [ ] Login exitoso
- [ ] Crear reserva exitosa
- [ ] Validar conflictos funcionan
- [ ] Jefe de Área confirma
- [ ] Admin maneja bloqueos
- [ ] Notificaciones aparecen

---

## 🎉 ¡Listo!

Tu sistema **Campus 360** está completamente funcional.

Para más detalles técnicos, consulta `README.md` y `API_DOCUMENTATION.md`

---

**¿Preguntas?** Revisa los archivos:
- `README.md` - Documentación general
- `API_DOCUMENTATION.md` - Endpoints detallados
- `backend/src/index.js` - Configuración del servidor
- `frontend/src/App.jsx` - Configuración del frontend
