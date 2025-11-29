# App de Gestión - AD Madrid Sur

## 1. Descripción General

Aplicación web interna para la gestión integral de la Agrupación Deportiva Madrid Sur. La plataforma está diseñada para optimizar la administración de equipos, jugadores y personal del club, además de ofrecer una vista pública con estadísticas de los partidos en tiempo real.

La aplicación se divide en dos áreas principales:
-   **Parte Privada:** Un panel de control seguro para Administradores y Entrenadores con distintos niveles de permisos.
-   **Parte Pública:** Una sección web que muestra información relevante de los partidos y clasificaciones de goleadores para los aficionados y familias.

## 2. Roles de Usuario y Funcionalidades

### Administrador
El rol con el nivel más alto de permisos. Los administradores pueden gestionar la estructura completa del club:
-   **Gestión de Entidades:** Crear, leer, modificar y eliminar (CRUD) perfiles para:
    -   Jugadores
    -   Entrenadores
    -   Equipos
    -   Otros Administradores
-   **Asignaciones:**
    -   Asignar entrenadores a uno o varios equipos.
    -   Asignar jugadores a un equipo específico.
-   **Seguridad:** Todas las operaciones de modificación o eliminación requieren una **confirmación** explícita para evitar acciones accidentales.

### Entrenador
Un rol con permisos enfocados en la gestión de sus equipos asignados.
-   **Gestión de Jugadores:** Crear, leer, modificar y eliminar (CRUD) perfiles de jugadores **únicamente dentro de los equipos que tiene asignados**.
-   **Registro de Partidos en Tiempo Real:** Utilizar un formulario sencillo e intuitivo para registrar eventos durante un partido, como:
    -   **Gol:** Jugador que marca y minuto.
    -   **Asistencia:** Jugador que asiste y minuto.
    -   **Tarjeta Amarilla:** Jugador amonestado y minuto.
    -   **Tarjeta Roja:** Jugador expulsado y minuto.
-   **Seguridad:** Al igual que los administradores, cualquier modificación o eliminación requiere **confirmación**.

## 3. Sección Pública

La cara visible de la aplicación, accesible para cualquier usuario, que muestra datos actualizados en tiempo real.
-   **Card de Eventos por Equipo:** Visualización en directo de los eventos (goles, asistencias, tarjetas) que los entrenadores registran durante los partidos.
-   **Card de "Pichichi" (Máximos Goleadores):**
    -   **Por Categoría:** Muestra el top 3 de goleadores en cada categoría (`Prebenjamín`, `Benjamín`, `Alevín`, `Infantil`, `Cadete`, `Juvenil`).
    -   **Por Equipo:** Muestra los máximos goleadores de cada equipo.
    -   **General:** Un ranking con el top 10 de goleadores de todo el club.

## 4. Stack Tecnológico

-   **Frontend:** **Angular** (`TypeScript`)
-   **UI Components:** **Angular Material** para una interfaz moderna, limpia y responsiva.
-   **Base de Datos:** **Firebase** (Firestore y Authentication).
-   **Seguridad:** Las contraseñas de los usuarios se almacenan en la base de datos de forma segura, utilizando codificación **Base64** antes de ser **encriptadas**.

## 5. Diseño y Estilo

-   **Responsividad:** La aplicación será completamente funcional y estéticamente agradable tanto en navegadores de escritorio como en dispositivos móviles.
-   **Inspiración Visual:** La estética, la paleta de colores (azules, blancos, rojos) y el estilo general se basarán en la [web oficial del club](https://www.admadridsur.org/).
-   **Guía de Componentes:** Se seguirán las directrices y componentes de [Angular Material](https://material.angular.dev/guide/getting-started) para asegurar consistencia y una experiencia de usuario intuitiva.