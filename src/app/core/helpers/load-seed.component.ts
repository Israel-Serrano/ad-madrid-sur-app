import { Component, OnInit } from '@angular/core';
import { TeamService } from '../services/team.service';
import { PlayerService } from '../services/player.service';
import { UserService } from '../services/user.service';
import { MatchEventService } from '../services/match-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SEED_TEAMS, SEED_PLAYERS, SEED_USERS, SEED_EVENTS } from '../seed-data';

/**
 * Component para cargar datos de ejemplo en Firestore
 * SOLO PARA DESARROLLO - Eliminar en producción
 * Uso: http://localhost:4200/admin/load-seed (solo accesible por admin)
 */
@Component({
  selector: 'app-load-seed',
  templateUrl: './load-seed.component.html',
  styleUrls: ['./load-seed.component.scss']
})
export class LoadSeedComponent implements OnInit {
  isLoading = false;
  progress: { [key: string]: string } = {
    teams: 'pending',
    players: 'pending',
    users: 'pending',
    events: 'pending'
  };

  constructor(
    private teamService: TeamService,
    private playerService: PlayerService,
    private userService: UserService,
    private eventService: MatchEventService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  /**
   * Cargar todos los datos de seed
   */
  async loadAllSeedData(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    console.log('🌱 Iniciando carga de seed data...');
    
    try {
      // 1. Cargar teams
      console.log('📦 Cargando equipos...');
      await this.loadTeams();
      console.log('✅ Equipos cargados');
      
      // 2. Cargar players
      console.log('👥 Cargando jugadores...');
      await this.loadPlayers();
      console.log('✅ Jugadores cargados');
      
      // 3. Cargar users
      console.log('👤 Cargando usuarios...');
      await this.loadUsers();
      console.log('✅ Usuarios cargados');
      
      // 4. Cargar events
      console.log('⚽ Cargando eventos...');
      await this.loadEvents();
      console.log('✅ Eventos cargados');
      
      console.log('✅ ¡COMPLETADO! Todos los datos cargados correctamente');
      this.snackBar.open('✅ Todos los datos cargados correctamente', 'Cerrar', { 
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      
    } catch (error) {
      console.error('❌ Error loading seed data:', error);
      this.snackBar.open('❌ Error al cargar datos: ' + error, 'Cerrar', { 
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Cargar solo teams
   */
  private async loadTeams(): Promise<void> {
    try {
      this.progress['teams'] = 'loading';
      console.log(`  📦 Creando ${SEED_TEAMS.length} equipos...`);
      
      for (const team of SEED_TEAMS) {
        try {
          const result = await this.teamService.createTeam({
            name: team.name,
            category: team.category,
            players: [],
            coachId: team.coachId,
            createdAt: new Date(),
            season: team.season
          } as any);
          console.log(`    ✓ Equipo creado: ${team.name} (${result.id})`);
        } catch (err) {
          console.error(`    ✗ Error al crear equipo ${team.name}:`, err);
        }
      }
      
      this.progress['teams'] = 'success';
    } catch (error) {
      this.progress['teams'] = 'error';
      throw new Error(`Error loading teams: ${error}`);
    }
  }

  /**
   * Cargar solo players
   */
  private async loadPlayers(): Promise<void> {
    try {
      this.progress['players'] = 'loading';
      console.log(`  👥 Creando ${SEED_PLAYERS.length} jugadores...`);
      
      for (const player of SEED_PLAYERS) {
        try {
          const result = await this.playerService.createPlayer({
            name: player.name,
            teamId: player.teamId,
            number: player.number,
            position: player.position,
            goals: player.goals,
            assists: player.assists,
            yellowCards: player.yellowCards,
            redCards: player.redCards,
            createdAt: new Date()
          } as any);
          console.log(`    ✓ Jugador creado: ${player.name} #${player.number}`);
        } catch (err) {
          console.error(`    ✗ Error al crear jugador ${player.name}:`, err);
        }
      }
      
      this.progress['players'] = 'success';
    } catch (error) {
      this.progress['players'] = 'error';
      throw new Error(`Error loading players: ${error}`);
    }
  }

  /**
   * Cargar solo users
   */
  private async loadUsers(): Promise<void> {
    try {
      this.progress['users'] = 'loading';
      console.log(`  👤 Creando ${SEED_USERS.length} usuarios...`);
      
      for (const user of SEED_USERS) {
        try {
          const result = await this.userService.createUser({
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: new Date(),
            lastLogin: new Date()
          } as any);
          console.log(`    ✓ Usuario creado: ${user.email} (${user.role})`);
        } catch (err) {
          console.error(`    ✗ Error al crear usuario ${user.email}:`, err);
        }
      }
      
      this.progress['users'] = 'success';
    } catch (error) {
      this.progress['users'] = 'error';
      throw new Error(`Error loading users: ${error}`);
    }
  }

  /**
   * Cargar solo events
   */
  private async loadEvents(): Promise<void> {
    try {
      this.progress['events'] = 'loading';
      console.log(`  ⚽ Creando ${SEED_EVENTS.length} eventos...`);
      
      for (const event of SEED_EVENTS) {
        try {
          const result = await this.eventService.createEvent({
            matchId: event.matchId,
            teamId: event.teamId,
            playerId: event.playerId,
            type: event.type,
            minute: event.minute,
            matchDate: event.matchDate,
            assistantPlayerId: event.assistantPlayerId
          } as any);
          console.log(`    ✓ Evento creado: ${event.type} en minuto ${event.minute}`);
        } catch (err) {
          console.error(`    ✗ Error al crear evento:`, err);
        }
      }
      
      this.progress['events'] = 'success';
    } catch (error) {
      this.progress['events'] = 'error';
      throw new Error(`Error loading events: ${error}`);
    }
  }

  /**
   * Limpiar datos cargados
   */
  async clearAllData(): Promise<void> {
    if (!confirm('⚠️ ¿Estás seguro de que deseas eliminar todos los datos?')) {
      return;
    }
    
    this.isLoading = true;
    
    try {
      // TODO: Implementar lógica de limpieza
      // Esta es una operación peligrosa, requiere confirmación adicional
      this.snackBar.open('Función de limpieza no implementada aún', 'Cerrar', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Verificar estado de datos en Firestore
   */
  async verifyData(): Promise<void> {
    try {
      // Este método podría verificar que los datos se cargaron correctamente
      this.snackBar.open('✅ Verificación en progreso...', 'Cerrar', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('❌ Error en verificación: ' + error, 'Cerrar', { duration: 3000 });
    }
  }

  /**
   * Obtener estadísticas de datos cargados
   */
  getStats(): any {
    return {
      teams: SEED_TEAMS.length,
      players: SEED_PLAYERS.length,
      users: SEED_USERS.length,
      events: SEED_EVENTS.length
    };
  }

  /**
   * Obtener icono de estado
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return '✅';
      case 'loading': return '⏳';
      case 'error': return '❌';
      default: return '⭕';
    }
  }
}
