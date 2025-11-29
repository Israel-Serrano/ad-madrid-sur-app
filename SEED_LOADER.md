# 🌱 Cargador de Datos de Ejemplo (Seed Data Loader)

## ¿Qué es?

`LoadSeedComponent` es una herramienta de desarrollo que permite cargar datos de ejemplo en Firestore con un solo click.

**IMPORTANTE**: Solo para desarrollo. Remover antes de producción.

---

## 🚀 Cómo Usar

### Paso 1: Login como Admin
```
Email: admin@admadriadsur.es
Contraseña: Admin@123
Rol: admin
```

### Paso 2: Navega a la ruta de carga
```
http://localhost:4200/admin/load-seed
```

### Paso 3: Click en "Cargar Todos los Datos"
El sistema cargará:
- ✅ 3 equipos (Benjamín A, Alevín A, Infantil A)
- ✅ 15 jugadores (5 por equipo)
- ✅ 3 usuarios (1 admin + 2 coaches)
- ✅ 10 eventos (goles, tarjetas)

### Paso 4: Verificar en Firebase Console
```
https://console.firebase.google.com
→ Firestore Database
→ Collections: teams, players, users, matchEvents
```

---

## 📊 Datos de Prueba

### Equipos
- Benjamín A (Coach: coach1)
- Alevín A (Coach: coach2)
- Infantil A (Coach: coach1)

### Usuarios
```
Admin:
  Email: admin@admadriadsur.es
  Contraseña: Admin@123
  Rol: admin

Coach 1:
  Email: coach1@admadriadsur.es
  Contraseña: Coach@123
  Rol: coach
  Equipos: Benjamín A, Infantil A

Coach 2:
  Email: coach2@admadriadsur.es
  Contraseña: Coach@123
  Rol: coach
  Equipos: Alevín A
```

### Jugadores por Equipo
```
Benjamín A:
  - Lucas García (#1, Portero)
  - Sergio López (#2, Defensa)
  - Pablo Martínez (#7, Delantero) - 5 goles
  - Miguel González (#9, Delantero) - 3 goles
  - David Rodríguez (#10, Centrocampista) - 2 goles

Alevín A:
  - Alejandro Pérez (#1, Portero)
  - José Fernández (#5, Defensa)
  - Carlos Sánchez (#8, Centrocampista) - 4 goles
  - Tomás Jiménez (#11, Delantero) - 6 goles
  - Ángel Ruiz (#9, Delantero) - 2 goles

Infantil A:
  - Rafael Torres (#1, Portero)
  - Enrique Morales (#3, Defensa)
  - Antonio Ramírez (#7, Delantero) - 7 goles
  - Manuel Díaz (#10, Centrocampista) - 3 goles
  - Francisco López (#9, Delantero) - 4 goles
```

### Eventos
```
10 eventos distribuidos:
- 8 Goles (con asistencias)
- 3 Tarjetas Amarillas
- 1 Tarjeta Roja
```

---

## 🔧 Características

### UI
- ✅ Información clara de datos a cargar
- ✅ Indicador de progreso por tipo de dato
- ✅ Mensajes de éxito/error
- ✅ Expansores con detalles (credenciales, advertencias)
- ✅ Responsive design

### Funcionalidades
- ✅ Cargar todos los datos
- ✅ Verificar datos (placeholder)
- ✅ Limpiar datos (protegido con confirmación)
- ✅ Estados: pending, loading, success, error

---

## ⚠️ Advertencias

1. **Desarrollo Solo**: No usar en producción
2. **Datos Ficticios**: Nombres, equipos y eventos son ejemplos
3. **Sobrescritura**: Si existen datos, se crearán duplicados
4. **Base de Datos**: Asegúrate de que Firestore esté vacío antes de cargar

---

## 📝 Próximos Pasos

Después de cargar los datos:

1. ✅ **Login con diferentes roles**
   ```
   Admin: admin@admadriadsur.es
   Coach: coach1@admadriadsur.es
   ```

2. ✅ **Verificar en Home Page**
   - Ver leaderboard Pichichi
   - Verificar eventos por equipo
   - Comprobar clasificación

3. ✅ **Testear CRUD**
   - Admin: crear/editar/eliminar equipos
   - Admin: crear/editar/eliminar jugadores
   - Coach: registrar nuevos eventos

4. ✅ **Testing Manual**
   - Seguir procedimientos en `TESTING.md`

---

## 🐛 Troubleshooting

### Problema: No veo el botón de carga
**Solución**: 
- Verifica estar logueado como admin
- Navega a `/admin/load-seed`
- Recarga la página

### Problema: Error al cargar
**Solución**:
- Verifica conectividad a Firebase
- Revisa console del navegador (F12)
- Verifica que Firestore esté habilitado
- Comprueba Security Rules

### Problema: Datos duplicados
**Solución**:
- Usa función "Limpiar Datos" (con confirmación)
- O borra manualmente en Firebase Console

---

## 🗑️ Remover antes de Producción

**⚠️ IMPORTANTE**: Este componente debe removerse o protegerse fuertemente antes de desplegar a producción.

```bash
# Para remover:
1. Eliminar: src/app/core/helpers/load-seed.component.*
2. Remover ruta de admin-routing.module.ts
3. Remover declaración de admin.module.ts
4. Eliminar importes relacionados
```

---

## 📚 Archivos Relacionados

- `src/app/core/seed-data.ts` - Datos de ejemplo
- `src/app/core/helpers/load-seed.component.ts` - Lógica
- `TESTING.md` - Guía de testing
- `PROGRESS.md` - Estado del proyecto

---

**Creado**: November 30, 2025  
**Estado**: ✅ Funcional  
**Para**: Desarrollo y testing local
