# 🎨 Carpeta de Recursos Visuales - Campus 360

## 📁 Estructura

```
frontend/public/images/
├── logo-unmsm.svg          # Logo de la Universidad (Escudo UNMSM)
├── bg-unmsm.svg            # Fondo para pantalla de Login (Morado UNMSM)
└── bg-biblioteca.svg       # Fondo para Dashboards (Tonos tierra - biblioteca)
```

## 📋 Descripción de Recursos

### 1️⃣ logo-unmsm.svg
- **Ubicación**: `/images/logo-unmsm.svg`
- **Uso**: Logo circular en LoginPage y Navbar
- **Descripción**: Escudo de la Universidad Nacional Mayor de San Marcos
- **Colores**: 
  - Morado oscuro (#4a148c)
  - Dorado (#d4af37)
  - Plata (#c0c0c0)
- **Dimensiones**: Escalable (SVG)
- **Ubicaciones en código**:
  - `LoginPage.jsx` - Dentro del logo circular principal
  - `Navbar.jsx` - Icono en la barra superior

### 2️⃣ bg-unmsm.svg
- **Ubicación**: `/images/bg-unmsm.svg`
- **Uso**: Fondo de la pantalla de Login
- **Descripción**: Fondo degradado morado con patrones geométricos sutiles
- **Colores**:
  - Morado oscuro (#2a0845)
  - Morado principal (#4a148c)
  - Dorado acentos (#d4af37)
  - Patrones de puntos y líneas decorativas
- **Dimensiones**: 1920x1080px
- **Elementos decorativos**:
  - Gradiente lineal principal
  - Patrón de puntos
  - Líneas diagonales (muy sutiles)
  - Formas geométricas (rectángulos y círculos)
  - Efecto de luz superior
- **Ubicación en código**:
  - `LoginPage.css` - `background: url('/images/bg-unmsm.svg')`

### 3️⃣ bg-biblioteca.svg
- **Ubicación**: `/images/bg-biblioteca.svg`
- **Uso**: Fondo de los Dashboards (después de login)
- **Descripción**: Fondo con textura de madera tipo biblioteca
- **Colores**:
  - Marrón oscuro (#3e2723)
  - Marrón medio (#5d4037)
  - Marrón claro (#8b4513 y #a0522d)
  - Dorado suave (#d4af37)
- **Dimensiones**: 1920x1080px
- **Elementos decorativos**:
  - Textura de madera simulada
  - Sombras sutiles superior e inferior
  - Líneas horizontales simulando estantes
  - Rectángulos simulando libros
  - Iluminación desde arriba
- **Ubicación en código**:
  - `DashboardLayout.css` - `background: url('/images/bg-biblioteca.svg')`

## 🎯 Integración en el Diseño

### Paleta de Colores Corporativa
```
Primario:     #4a148c (Morado UNMSM)
Primario Dark: #2a0845 
Primario Light: #7b1fa2
Acento:       #d4af37 (Dorado)
Text Primary: #333333
Text Secondary: #666666
```

### Tipografía
- Sistema de fuentes: San Francisco, Segoe UI, Roboto
- Pesos: 400, 500, 600, 700
- Escalas: 0.75rem a 2.8rem

## 📱 Responsive Design

### Puntos de Quiebre
- **Desktop**: 1025px+
- **Tablet**: 769px - 1024px
- **Mobile**: Hasta 768px

### Adaptaciones por Dispositivo

#### Login Page
- Desktop: Logo 130px, Cards con sombra completa
- Tablet: Logo 110px, Layout ajustado
- Mobile: Logo 90px, Botones en fila única

#### Navbar
- Desktop: Logo 45px, Menú horizontal
- Tablet: Layout comprimido
- Mobile: Logo 35px, Información reducida

#### Dashboards
- Desktop: Sidebar 280px + Contenido flexible
- Tablet: Sidebar 240px, gap reducido
- Mobile: Sidebar completa arriba, grid 2 columnas

## 🔳 Componentes Visuales

### Elevación (Shadows)
```css
--shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.08)
--shadow-md:  0 5px 15px rgba(0, 0, 0, 0.12)
--shadow-lg:  0 10px 30px rgba(0, 0, 0, 0.15)
--shadow-xl:  0 20px 50px rgba(0, 0, 0, 0.2)
```

### Espaciado
- Micro: 0.25rem (4px)
- Pequeño: 0.5rem (8px)
- Base: 1rem (16px)
- Grande: 1.5rem (24px)
- Extra: 2rem+ (32px+)

### Bordes y Esquinas
- Inputs: `border-radius: 10px`
- Cards: `border-radius: 14px-18px`
- Pequeños: `border-radius: 4-8px`

### Transiciones
- Duración estándar: 0.3s
- Timing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Hover: `-2px` en Y, elevación aumentada

## 🔧 Archivos CSS Relacionados

| Archivo | Propósito | Usa |
|---------|-----------|-----|
| `LoginPage.css` | Página de login | bg-unmsm.svg, logo-unmsm.svg |
| `Navbar.css` | Barra de navegación | logo-unmsm.svg |
| `DashboardLayout.css` | Layout dashboards | bg-biblioteca.svg |
| `index.css` | Estilos globales | Variables CSS |

## 📐 Optimizaciones

### Performance
- ✅ SVG formato: Escalable sin pérdida
- ✅ Background fixed: Efecto parallax sutil
- ✅ Backdrop filter: Degradación elegante en navegadores antiguos
- ✅ Hardware acceleration: `transform` y `will-change`

### Accesibilidad
- ✅ Contraste WCAG AA cumplido
- ✅ Alt text en logos
- ✅ Overlay oscuro para legibilidad en fondos
- ✅ Enfoque visible en botones

## 🎨 Ejemplos de Uso

### Reutilizar Logo
```jsx
<img src="/images/logo-unmsm.svg" alt="UNMSM Logo" />
```

### Agregar Nuevo Fondo
```css
.new-section {
  background: url('/images/bg-biblioteca.svg') center/cover no-repeat fixed;
}
```

### Usar Variables de Color
```css
color: var(--primary);
background: var(--accent);
border: 1px solid var(--border-light);
```

---

**Campus 360 - Universidad Nacional Mayor de San Marcos**  
*Sistema de Reserva de Ambientes - Diseño Moderno y Profesional*
