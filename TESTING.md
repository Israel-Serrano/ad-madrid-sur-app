# 🚀 AD Madrid Sur - Guía de Testing

## 📋 Requisitos Previos

- Node.js v18+
- Angular CLI 17.x
- Firebase Project configurado
- Navegador moderno (Chrome, Firefox, Safari, Edge)

---

## 🧪 Testing Manual de Nuevas Características

### 1. Test: Role-Based Access Control (HasRoleDirective)

**Objetivo**: Verificar que solo usuarios con rol específico ven ciertos elementos

**Pasos**:

```bash
# 1. Compilar y ejecutar
npm run build
npm start

# 2. Ir a http://localhost:4200/login

# 3. Test Admin
   - Email: admin@admadriadsur.es
   - Contraseña: Admin@123
   - ✅ ESPERADO: Ver 3 opciones en menú (Equipos, Jugadores, Usuarios)
   - ✅ ESPERADO: Directiva *appHasRole="'admin'" permite ver elementos

# 4. Test Coach
   - Email: coach1@admadriadsur.es
   - Contraseña: Coach@123
   - ✅ ESPERADO: Ver 2 opciones en menú (Mis Equipos, Registrar Evento)
   - ✅ ESPERADO: Directiva *appHasRole="'coach'" permite ver elementos
```

**Resultado**: 
- ✅ Elements correctly shown/hidden based on user role
- ✅ Directive updates reactively when user changes

---

### 2. Test: Logout Functionality

**Objetivo**: Verificar que logout limpia sesión y redirige correctamente

**Pasos**:

```bash
# 1. Login como Admin o Coach
# 2. Hacer click en botón logout (ícono en top-right)
# 3. Verificar:
   - ✅ Snackbar notification aparece: "Sesión cerrada correctamente"
   - ✅ Redirección a /login después de 1-2 segundos
   - ✅ Reload página: no debe estar autenticado
   - ✅ AuthService.currentUser$ retorna null
```

**Expected Output**:
```
Logout button clicked
→ Snackbar: "Sesión cerrada correctamente"
→ AuthService.logout() executes
→ Navigate to /login
→ Session cleared
```

---

### 3. Test: Real-time Events Display

**Objetivo**: Verificar que eventos se muestran correctamente en home

**Pasos**:

```bash
# 1. Ir a http://localhost:4200/public (sin login)
# 2. Scroll a sección "Eventos en Vivo"
# 3. Verificar:
   - ✅ Tarjetas por equipo (Benjamín A, Alevín A, Infantil A)
   - ✅ Eventos organizados por tipo (⚽ Goles, 🟨 Amarillas, 🔴 Rojas)
   - ✅ Muestra: Nombre jugador, minuto, asistencia (si aplica)
   - ✅ Responsive: En mobile, tarjetas apiladas verticalmente
```

**Estructura esperada**:
```
📊 Eventos en Vivo
  └─ Benjamín A (Benjamín)
     ├─ ⚽ Goles
     │  └─ Lucas García (minuto 5') [Asistencia: David Rodríguez]
     ├─ 🟨 Amarillas
     │  └─ Sergio López (minuto 18')
     └─ 🔴 Rojas
        └─ (Sin eventos)
  └─ Alevín A (Alevín)
     └─ ...
```

---

### 4. Test: Pichichi Leaderboard

**Objetivo**: Verificar clasificaciones se calculan correctamente

**Pasos**:

```bash
# 1. Ir a http://localhost:4200/public
# 2. Scroll a sección "Clasificaciones (Pichichi)"
# 3. Verificar:
   - ✅ Top 10 General: ordenado por goles descendente
   - ✅ Por Categoría: máximo 3 jugadores por categoría
   - ✅ Por Equipo: máximo 3 goleadores por equipo
   - ✅ Muestra: Posición, Jugador, Equipo, Goles
```

**Expected Output** (con seed data):
```
Top 10 General:
  1. Antonio Ramírez (Infantil A) - 7 goles
  2. Tomás Jiménez (Alevín A) - 6 goles
  3. Pablo Martínez (Benjamín A) - 5 goles
  ...

Por Categoría - Benjamín:
  1. Pablo Martínez - 5 goles
  2. Miguel González - 3 goles
  3. David Rodríguez - 2 goles

Por Categoría - Alevín:
  1. Tomás Jiménez - 6 goles
  2. Carlos Sánchez - 4 goles
  3. Ángel Ruiz - 2 goles

Por Equipo - Benjamín A:
  1. Pablo Martínez - 5 goles
  2. Miguel González - 3 goles
  3. David Rodríguez - 2 goles
```

---

### 5. Test: Event Filtering (LOG)

**Objetivo**: Verificar filtrado de eventos por minuto

**Pasos**:

```bash
# 1. Ir a http://localhost:4200/coach (login como coach)
# 2. Ir a "Registrar Evento"
# 3. Pruebas:
   - ✅ Seleccionar equipo → carga lista de jugadores
   - ✅ Seleccionar tipo de evento (Goal/Yellow Card/etc)
   - ✅ Ingresar minuto y jugador
   - ✅ Para Goals: campo de asistente aparece
   - ✅ Click "Guardar evento" → snackbar success/error
   - ✅ Evento aparece en tiempo real en home
```

---

## 📊 Testing de Responsive Design

### Desktop (1920x1080)
```bash
npm start
# Abrir DevTools: F12
# Verificar:
  - ✅ Grid 3 columnas en teams-grid
  - ✅ Sidenav en mode 'side' (siempre visible)
  - ✅ Toolbar completo con espacio
```

### Tablet (768x1024)
```bash
# En DevTools, ir a Device Emulation
# Seleccionar iPad
# Verificar:
  - ✅ Grid 2 columnas
  - ✅ Sidenav aún visible
  - ✅ Fuentes legibles
```

### Mobile (375x667)
```bash
# En DevTools, seleccionar iPhone
# Verificar:
  - ✅ Grid 1 columna (stacked)
  - ✅ Sidenav en mode 'over' (overlay)
  - ✅ Hamburger menu funciona
  - ✅ Botones accesibles
  - ✅ Scroll horizontal NO aparece
```

---

## 🔐 Security Testing

### Test: Firebase Security Rules
```bash
# Verificar en Firebase Console:

# 1. Usuarios solo ven datos de sus equipos
   GET /users/{userId}
   ✅ Solo el propio usuario puede leer
   ✅ Solo admin puede actualizar role

# 2. Coaches solo pueden crear eventos en sus equipos
   CREATE /matchEvents
   ✅ Solo coach del equipo puede crear

# 3. Players datos públicos (para leaderboard)
   GET /players
   ✅ Todos pueden leer
   ✅ Solo owner puede actualizar stats
```

---

## 📝 Testing Manual: Seed Data

### 1. Cargar datos de ejemplo:

**Opción A: Firestore Console**
```
1. Ir a https://console.firebase.google.com
2. Firestore Database → Crear colecciones:
   - teams
   - players
   - users
   - matchEvents
3. Copiar datos de seed-data.ts
```

**Opción B: Script Node**
```bash
# Crear archivo load-seed.js
node load-seed.js

# O ejecutar en Angular component
import { SEED_TEAMS, SEED_PLAYERS, SEED_USERS, SEED_EVENTS } from './seed-data';
```

---

## ✅ Checklist de Validación

- [ ] **Login**
  - [ ] Admin login funciona
  - [ ] Coach login funciona
  - [ ] Error message en credenciales inválidas
  - [ ] Spinner carga durante auth

- [ ] **Logout**
  - [ ] Botón logout visible en dashboard
  - [ ] Snackbar notification aparece
  - [ ] Redirección a /login
  - [ ] Session limpiada (no reutilizar token)

- [ ] **Role-based Access**
  - [ ] Admin ve todas las opciones del menú
  - [ ] Coach ve solo opciones de coach
  - [ ] *appHasRole directiva funciona
  - [ ] Intento de acceso directo a /admin redirige

- [ ] **Events**
  - [ ] LogEventComponent carga jugadores correctamente
  - [ ] Eventos se registran en Firestore
  - [ ] Eventos aparecen en tiempo real en home
  - [ ] Asistencias se registran correctamente
  - [ ] Tarjetas se muestran con colores correctos

- [ ] **Leaderboard**
  - [ ] Top 10 general ordena por goles
  - [ ] Categorías agrupan correctamente
  - [ ] Equipos muestran goleadores
  - [ ] Números son exactos

- [ ] **Responsive**
  - [ ] Desktop: 3 columnas
  - [ ] Tablet: 2 columnas
  - [ ] Mobile: 1 columna
  - [ ] No hay scroll horizontal

- [ ] **Performance**
  - [ ] Home carga en <2 segundos
  - [ ] Sin errores en console
  - [ ] Bundle size dentro de presupuesto

---

## 🐛 Troubleshooting

### Problema: Events no aparecen en home
**Solución**:
```bash
# 1. Verificar Firebase connection:
   console.log(this.matchEventService.getAllEvents())
# 2. Verificar datos existen en Firestore
# 3. Verificar playerMap cargó jugadores
```

### Problema: Logout no funciona
**Solución**:
```typescript
// En console:
firebase.auth().signOut()
// Debe desloguear sin error
```

### Problema: Directiva no oculta elementos
**Solución**:
```bash
# 1. Verificar CoreModule exporta HasRoleDirective
# 2. Verificar sintaxis: *appHasRole="'admin'"
# 3. Verificar currentUser$ emite correctamente
```

---

## 📞 Contacto & Documentación

- Firebase Console: https://console.firebase.google.com
- Angular Material: https://material.angular.io
- RxJS Docs: https://rxjs.dev
- TypeScript: https://www.typescriptlang.org/docs

---

**Última actualización**: 2025-11-29
**Estado**: ✅ Listo para testing manual
