import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from 'src/app/core/models/team.model';
import { Player } from 'src/app/core/models/player.model';
import { MatchEvent } from 'src/app/core/models/match-event.model';
import { TeamService } from 'src/app/core/services/team.service';
import { MatchEventService } from 'src/app/core/services/match-event.service';
import { PlayerService } from 'src/app/core/services/player.service';
import { map, switchMap } from 'rxjs/operators';

export interface PlayerStats {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  teamId: string;
  teamName: string;
  category: string;
}

export interface Leaderboard {
  overall: PlayerStats[];
  byCategory: { [key: string]: PlayerStats[] };
  byTeam: { [key: string]: PlayerStats[] };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  teams$!: Observable<Team[]>;
  leaderboard$!: Observable<Leaderboard>;
  events$!: Observable<MatchEvent[]>;
  playerMap: Map<string, Player> = new Map();
  selectedTeamIdFilter: string = '';
  minuteFilter: number = 0;

  constructor(
    private teamService: TeamService,
    private matchEventService: MatchEventService,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
    this.leaderboard$ = this.buildLeaderboard();
    this.events$ = this.matchEventService.getAllEvents();
    
    // Load player map for lookups
    this.playerService.getPlayers().subscribe(players => {
      players.forEach(player => {
        this.playerMap.set(player.id, player);
      });
    });
  }

  buildLeaderboard(): Observable<Leaderboard> {
    return this.playerService.getPlayers().pipe(
      switchMap((players: Player[]) => {
        return this.teamService.getTeams().pipe(
          map((teams: Team[]) => {
            const playerMap = new Map();

            // Create player stats from player documents
            players.forEach((player: Player) => {
              const team = teams.find((t: Team) => t.id === player.teamId);
              playerMap.set(player.id, {
                playerId: player.id,
                playerName: player.name,
                goals: player.goals || 0,
                assists: player.assists || 0,
                yellowCards: player.yellowCards || 0,
                redCards: player.redCards || 0,
                teamId: player.teamId,
                teamName: team?.name || 'Unknown',
                category: team?.category || 'Unknown'
              });
            });

            // Build leaderboards
            const leaderboard: Leaderboard = {
              overall: [],
              byCategory: {},
              byTeam: {}
            };

            // Overall top 10
            leaderboard.overall = Array.from(playerMap.values())
              .sort((a: any, b: any) => b.goals - a.goals)
              .slice(0, 10);

            // By category - top 3 per category
            const categories = ['Prebenjamín', 'Benjamín', 'Alevín', 'Infantil', 'Cadete', 'Juvenil'];
            categories.forEach(category => {
              leaderboard.byCategory[category] = Array.from(playerMap.values())
                .filter((p: any) => p.category === category)
                .sort((a: any, b: any) => b.goals - a.goals)
                .slice(0, 3);
            });

            // By team - top scorers per team
            teams.forEach((team: Team) => {
              leaderboard.byTeam[team.id] = Array.from(playerMap.values())
                .filter((p: any) => p.teamId === team.id)
                .sort((a: any, b: any) => b.goals - a.goals)
                .slice(0, 3);
            });

            return leaderboard;
          })
        );
      })
    );
  }

  getPlayerName(playerId: string): string {
    return this.playerMap.get(playerId)?.name || `Jugador #${playerId}`;
  }

  getTeamEvents(events: MatchEvent[], teamId: string, eventType?: string): MatchEvent[] {
    if (!events) return [];
    return events
      .filter(e => e.teamId === teamId && (!eventType || e.type === eventType))
      .sort((a, b) => b.minute - a.minute);
  }

  getFilteredEvents(events: MatchEvent[], teamId: string, eventType?: string): MatchEvent[] {
    if (!events) return [];
    return events
      .filter(e => 
        e.teamId === teamId && 
        (!eventType || e.type === eventType) &&
        (this.minuteFilter === 0 || e.minute >= this.minuteFilter)
      )
      .sort((a, b) => b.minute - a.minute);
  }

  getEventIcon(eventType: string): string {
    switch (eventType) {
      case 'Goal': return 'sports_soccer';
      case 'Assist': return 'touch_app';
      case 'Yellow Card': return 'warning';
      case 'Red Card': return 'cancel';
      default: return 'event';
    }
  }
}


