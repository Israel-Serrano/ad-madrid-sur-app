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
    
    try {
      // 1. Cargar teams
      await this.loadTeams();
      
      // 2. Cargar players
      await this.loadPlayers();
      
      // 3. Cargar users
      await this.loadUsers();
      
      // 4. Cargar events
      await this.loadEvents();
      
      this.snackBar.open('✅ Todos los datos cargados correctamente', 'Cerrar', { 
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      
    } catch (error) {
      console.error('Error loading seed data:', error);
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
      
      for (const team of SEED_TEAMS) {
        await this.teamService.createTeam({
          name: team.name,
          category: team.category,
          players: [],
          coachId: team.coachId,
          createdAt: new Date(),
          season: team.season
        } as any);
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
      
      for (const player of SEED_PLAYERS) {
        await this.playerService.createPlayer({
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
      
      for (const user of SEED_USERS) {
        await this.userService.createUser({
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: new Date(),
          lastLogin: new Date()
        } as any);
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
      
      for (const event of SEED_EVENTS) {
        await this.eventService.createEvent({
          matchId: event.matchId,
          teamId: event.teamId,
          playerId: event.playerId,
          type: event.type,
          minute: event.minute,
          matchDate: event.matchDate,
          assistantPlayerId: event.assistantPlayerId
        } as any);
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
