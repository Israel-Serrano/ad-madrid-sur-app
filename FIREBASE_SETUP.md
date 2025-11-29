# 🔐 Configuración de Firebase Auth y Firestore

## ⚠️ IMPORTANTE: ANTES DE USAR LA APP

Debes crear manualmente los usuarios en Firebase Authentication ANTES de poder hacer login.

---

## 📋 Paso 1: Crear Usuarios en Firebase Console

### Acceder a Firebase Console
1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto: **ad-madrid-sur**
3. Navega a: **Authentication** (en el menú izquierdo)
4. Click en la pestaña: **Users**
5. Click en: **Create user** (botón azul)

### Crear Usuario 1: Admin
```
Email: admin@admadriadsur.es
Contraseña: Admin@123
```
**Pasos:**
1. Click "Create user"
2. Ingresa el email y contraseña
3. Click "Create"

### Crear Usuario 2: Coach 1
```
Email: coach1@admadriadsur.es
Contraseña: Coach@123
```
**Pasos:**
1. Click "Create user"
2. Ingresa el email y contraseña
3. Click "Create"

### Crear Usuario 3: Coach 2
```
Email: coach2@admadriadsur.es
Contraseña: Coach@123
```
**Pasos:**
1. Click "Create user"
2. Ingresa el email y contraseña
3. Click "Create"

---

## 🗄️ Paso 2: Cargar Datos de Firestore

Una vez creados los usuarios en Auth, carga los datos en Firestore:

### Método: Usar LoadSeedComponent (RECOMENDADO)
```
1. Abre: http://localhost:4201/login
   (Nota: Puerto 4201 si 4200 está ocupado)

2. Login con credenciales:
   Email: admin@admadriadsur.es
   Contraseña: Admin@123

3. Navega a: http://localhost:4201/admin/load-seed

4. Click en: "📥 Cargar Todos los Datos"

5. Verifica: 
   ✅ Equipos: 3 equipos cargados
   ✅ Jugadores: 15 jugadores cargados
   ✅ Eventos: 10 eventos cargados
   ✅ Usuario admin guardado en Firestore
```

### Verificar en Firestore Console
1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto
3. Click en: **Firestore Database**
4. Verifica las colecciones:
   - `teams` - 3 documentos
   - `players` - 15 documentos
   - `matchEvents` - 10 documentos
   - `users` - 3 documentos (admin, coach1, coach2)

---

## 🚀 Paso 3: Probar la App

### Login como Admin
```
http://localhost:4201/login

Email: admin@admadriadsur.es
Contraseña: Admin@123

Deberías navegar a: /admin/dashboard
```

### Login como Coach
```
Email: coach1@admadriadsur.es
Contraseña: Coach@123

Deberías navegar a: /coach/dashboard
```

### Acceder como Usuario Público (sin login)
```
http://localhost:4201/public
o
http://localhost:4201/

Deberías ver la página de inicio y leaderboard
```

---

## ❌ Troubleshooting

### Error: "Inicio de sesión fallido"
**Causa:** El usuario no existe en Firebase Auth

**Solución:**
1. Verifica que creaste el usuario en Firebase Console
2. Verifica que escribiste el email correctamente (con @admadriadsur.es)
3. Verifica la contraseña (Admin@123 o Coach@123)

### Error: "User exists in Auth but not in Firestore"
**Causa:** El usuario existe en Auth pero no en la colección `users` de Firestore

**Solución:**
1. Usa LoadSeedComponent para cargar los datos
2. O crea manualmente el documento en Firestore:
   ```
   Collection: users
   Document ID: admin-1 (o el UID del usuario)
   Datos:
   {
     email: "admin@admadriadsur.es",
     name: "Administrador Principal",
     role: "admin",
     createdAt: Timestamp.now(),
     lastLogin: Timestamp.now()
   }
   ```

### Port 4200 ocupado
**Solución:** La app usa puerto 4201 automáticamente
```
npm start -- --port 4201
```

---

## 📝 Resumen de Credenciales

| Rol   | Email                    | Contraseña | URL                    |
|-------|--------------------------|------------|------------------------|
| Admin | admin@admadriadsur.es    | Admin@123  | /admin/dashboard       |
| Coach | coach1@admadriadsur.es   | Coach@123  | /coach/dashboard       |
| Coach | coach2@admadriadsur.es   | Coach@123  | /coach/dashboard       |
| Public| (sin login)              | -          | /public o /            |

---

## 🔒 Firestore Security Rules

⚠️ **Pendiente de implementar**

Actualmente, Firestore tiene reglas públicas (testing).
Antes de producción, configura reglas de seguridad en:
https://console.firebase.google.com → Firestore Database → Rules

Reglas recomendadas:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios - solo lectura propia, admin puede leer todos
    match /users/{userId} {
      allow read: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if false; // Crear via Admin SDK
    }
    
    // Equipos - lectura pública, coaches pueden crear/editar sus equipos
    match /teams/{teamId} {
      allow read: if true;
      allow create, update: if request.auth != null && 
                             (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.coachId == teamId);
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Eventos - coaches pueden crear/leer sus eventos
    match /matchEvents/{eventId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                            request.data.coachId == request.auth.uid;
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
  }
}
```
