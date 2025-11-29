// Datos de Ejemplo para AD Madrid Sur - Firestore
// Guardar estos datos manualmente en Firestore o usar este script

// TEAMS (3 equipos)
export const SEED_TEAMS = [
  {
    id: 'team-1',
    name: 'Benjamín A',
    category: 'Benjamín',
    players: [],
    coachId: 'coach-1',
    createdAt: new Date(),
    season: '2024-2025'
  },
  {
    id: 'team-2',
    name: 'Alevín A',
    category: 'Alevín',
    players: [],
    coachId: 'coach-2',
    createdAt: new Date(),
    season: '2024-2025'
  },
  {
    id: 'team-3',
    name: 'Infantil A',
    category: 'Infantil',
    players: [],
    coachId: 'coach-1',
    createdAt: new Date(),
    season: '2024-2025'
  }
];

// PLAYERS (15 jugadores - 5 por equipo)
export const SEED_PLAYERS = [
  // Benjamín A
  {
    id: 'player-1',
    name: 'Lucas García',
    teamId: 'team-1',
    number: 1,
    position: 'Portero',
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-2',
    name: 'Sergio López',
    teamId: 'team-1',
    number: 2,
    position: 'Defensa',
    goals: 1,
    assists: 2,
    yellowCards: 1,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-3',
    name: 'Pablo Martínez',
    teamId: 'team-1',
    number: 7,
    position: 'Delantero',
    goals: 5,
    assists: 2,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-4',
    name: 'Miguel González',
    teamId: 'team-1',
    number: 9,
    position: 'Delantero',
    goals: 3,
    assists: 1,
    yellowCards: 2,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-5',
    name: 'David Rodríguez',
    teamId: 'team-1',
    number: 10,
    position: 'Centrocampista',
    goals: 2,
    assists: 4,
    yellowCards: 1,
    redCards: 0,
    createdAt: new Date()
  },
  // Alevín A
  {
    id: 'player-6',
    name: 'Alejandro Pérez',
    teamId: 'team-2',
    number: 1,
    position: 'Portero',
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-7',
    name: 'José Fernández',
    teamId: 'team-2',
    number: 5,
    position: 'Defensa',
    goals: 0,
    assists: 1,
    yellowCards: 1,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-8',
    name: 'Carlos Sánchez',
    teamId: 'team-2',
    number: 8,
    position: 'Centrocampista',
    goals: 4,
    assists: 3,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-9',
    name: 'Tomás Jiménez',
    teamId: 'team-2',
    number: 11,
    position: 'Delantero',
    goals: 6,
    assists: 2,
    yellowCards: 1,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-10',
    name: 'Ángel Ruiz',
    teamId: 'team-2',
    number: 9,
    position: 'Delantero',
    goals: 2,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  },
  // Infantil A
  {
    id: 'player-11',
    name: 'Rafael Torres',
    teamId: 'team-3',
    number: 1,
    position: 'Portero',
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-12',
    name: 'Enrique Morales',
    teamId: 'team-3',
    number: 3,
    position: 'Defensa',
    goals: 1,
    assists: 1,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-13',
    name: 'Antonio Ramírez',
    teamId: 'team-3',
    number: 7,
    position: 'Delantero',
    goals: 7,
    assists: 3,
    yellowCards: 2,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-14',
    name: 'Manuel Díaz',
    teamId: 'team-3',
    number: 10,
    position: 'Centrocampista',
    goals: 3,
    assists: 2,
    yellowCards: 1,
    redCards: 0,
    createdAt: new Date()
  },
  {
    id: 'player-15',
    name: 'Francisco López',
    teamId: 'team-3',
    number: 9,
    position: 'Delantero',
    goals: 4,
    assists: 1,
    yellowCards: 0,
    redCards: 0,
    createdAt: new Date()
  }
];

// USERS (3 usuarios)
export const SEED_USERS = [
  {
    id: 'admin-1',
    email: 'admin@admadriadsur.es',
    name: 'Administrador Principal',
    role: 'admin',
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: 'coach-1',
    email: 'coach1@admadriadsur.es',
    name: 'Entrenador García',
    role: 'coach',
    teamIds: ['team-1', 'team-3'],
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: 'coach-2',
    email: 'coach2@admadriadsur.es',
    name: 'Entrenador López',
    role: 'coach',
    teamIds: ['team-2'],
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// MATCH EVENTS (10 eventos de ejemplo)
export const SEED_EVENTS = [
  {
    id: 'event-1',
    matchId: 'match-1',
    teamId: 'team-1',
    playerId: 'player-3',
    type: 'Goal' as const,
    minute: 5,
    matchDate: new Date('2024-11-25'),
    assistantPlayerId: 'player-5'
  },
  {
    id: 'event-2',
    matchId: 'match-1',
    teamId: 'team-1',
    playerId: 'player-4',
    type: 'Goal' as const,
    minute: 12,
    matchDate: new Date('2024-11-25'),
    assistantPlayerId: 'player-2'
  },
  {
    id: 'event-3',
    matchId: 'match-1',
    teamId: 'team-1',
    playerId: 'player-2',
    type: 'Yellow Card' as const,
    minute: 18,
    matchDate: new Date('2024-11-25')
  },
  {
    id: 'event-4',
    matchId: 'match-1',
    teamId: 'team-1',
    playerId: 'player-3',
    type: 'Goal' as const,
    minute: 35,
    matchDate: new Date('2024-11-25')
  },
  {
    id: 'event-5',
    matchId: 'match-2',
    teamId: 'team-2',
    playerId: 'player-9',
    type: 'Goal' as const,
    minute: 8,
    matchDate: new Date('2024-11-26'),
    assistantPlayerId: 'player-8'
  },
  {
    id: 'event-6',
    matchId: 'match-2',
    teamId: 'team-2',
    playerId: 'player-8',
    type: 'Goal' as const,
    minute: 22,
    matchDate: new Date('2024-11-26'),
    assistantPlayerId: 'player-9'
  },
  {
    id: 'event-7',
    matchId: 'match-2',
    teamId: 'team-2',
    playerId: 'player-9',
    type: 'Yellow Card' as const,
    minute: 45,
    matchDate: new Date('2024-11-26')
  },
  {
    id: 'event-8',
    matchId: 'match-3',
    teamId: 'team-3',
    playerId: 'player-13',
    type: 'Goal' as const,
    minute: 10,
    matchDate: new Date('2024-11-27'),
    assistantPlayerId: 'player-14'
  },
  {
    id: 'event-9',
    matchId: 'match-3',
    teamId: 'team-3',
    playerId: 'player-15',
    type: 'Goal' as const,
    minute: 25,
    matchDate: new Date('2024-11-27')
  },
  {
    id: 'event-10',
    matchId: 'match-3',
    teamId: 'team-3',
    playerId: 'player-13',
    type: 'Red Card' as const,
    minute: 60,
    matchDate: new Date('2024-11-27')
  }
];

/**
 * INSTRUCCIONES PARA CARGAR SEED DATA EN FIRESTORE
 * 
 * Opción 1: A través de Firestore Console (https://console.firebase.google.com)
 * 1. Ir a Firestore Database
 * 2. Crear colecciones: teams, players, users, matchEvents
 * 3. Copiar cada documento manualmente O usar Firebase Admin SDK
 * 
 * Opción 2: Usar Firebase Admin SDK
 * ```typescript
 * import admin from 'firebase-admin';
 * 
 * async function seedDatabase() {
 *   const db = admin.firestore();
 *   
 *   // Guardar teams
 *   for (const team of SEED_TEAMS) {
 *     await db.collection('teams').doc(team.id).set(team);
 *   }
 *   
 *   // Guardar players
 *   for (const player of SEED_PLAYERS) {
 *     await db.collection('players').doc(player.id).set(player);
 *   }
 *   
 *   // Guardar users
 *   for (const user of SEED_USERS) {
 *     await db.collection('users').doc(user.id).set(user);
 *   }
 *   
 *   // Guardar events
 *   for (const event of SEED_EVENTS) {
 *     await db.collection('matchEvents').doc(event.id).set(event);
 *   }
 *   
 *   console.log('Seed data cargado exitosamente');
 * }
 * ```
 * 
 * Opción 3: Crear servicio en Angular para cargar datos
 * Importar este archivo en un componente admin y ejecutar:
 * ```typescript
 * async loadSeedData() {
 *   // Usar los servicios para guardar datos
 * }
 * ```
 */
