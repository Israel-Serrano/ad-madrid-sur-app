import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { TeamService } from '../../core/services/team.service';
import { PlayerService } from '../../core/services/player.service';
import { MatchEventService } from '../../core/services/match-event.service';
import { Team } from '../../core/models/team.model';
import { Player } from '../../core/models/player.model';
import { MatchEventType } from '../../core/models/match-event.model';

@Component({
  selector: 'app-log-event',
  templateUrl: './log-event.component.html',
  styleUrls: ['./log-event.component.scss']
})
export class LogEventComponent implements OnInit {
  form!: FormGroup;
  teams$: Observable<Team[]> = of([]);
  players$: Observable<Player[]> = of([]);
  eventTypes: MatchEventType[] = ['Goal', 'Assist', 'Yellow Card', 'Red Card'];
  selectedTeamId: string = '';
  recentEvents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private matchEventService: MatchEventService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      teamId: ['', Validators.required],
      playerId: ['', Validators.required],
      eventType: ['', Validators.required],
      minute: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      assistantPlayerId: ['']
    });

    // Get teams for current coach
    this.teams$ = this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.teamService.getTeamsForCoach(user.uid);
        }
        return of([]);
      })
    );

    // Update players when team changes
    this.form.get('teamId')?.valueChanges.subscribe(teamId => {
      this.selectedTeamId = teamId;
      if (teamId) {
        this.players$ = this.playerService.getPlayersByTeam(teamId);
      }
    });
  }

  onEventTypeChange(): void {
    const eventType = this.form.get('eventType')?.value;
    const assistantControl = this.form.get('assistantPlayerId');
    
    if (eventType === 'Goal') {
      assistantControl?.setValidators([]);
    } else if (eventType === 'Assist') {
      assistantControl?.setValidators([Validators.required]);
    } else {
      assistantControl?.setValidators([]);
    }
    assistantControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    const eventData: any = {
      teamId: formValue.teamId,
      playerId: formValue.playerId,
      type: formValue.eventType,
      minute: formValue.minute,
      matchId: `match_${new Date().getTime()}`, // Simple match ID generation
    };

    // Add assistantPlayerId only if it's a Goal event
    if (formValue.eventType === 'Goal' && formValue.assistantPlayerId) {
      eventData.assistantPlayerId = formValue.assistantPlayerId;
    }

    // Create event in Firebase
    this.matchEventService.createEvent(eventData).then(() => {
      // Add to recent events list
      this.recentEvents.unshift({
        ...eventData,
        id: `temp_${Date.now()}`,
        timestamp: new Date()
      });

      // Keep only last 10 events in the list
      if (this.recentEvents.length > 10) {
        this.recentEvents.pop();
      }

      // Update player stats
      this.updatePlayerStats(formValue.playerId, formValue.eventType, formValue.assistantPlayerId);

      // Reset form
      this.form.reset();
      this.selectedTeamId = '';
    }).catch(error => {
      console.error('Error creating event:', error);
    });
  }

  private updatePlayerStats(playerId: string, eventType: MatchEventType, assistantPlayerId?: string): void {
    this.playerService.getPlayers().pipe(take(1)).subscribe(players => {
      const player = players.find(p => p.id === playerId);
      if (player) {
        const updateData: any = {};
        
        if (eventType === 'Goal') {
          updateData.goals = (player.goals || 0) + 1;
        } else if (eventType === 'Assist' && assistantPlayerId) {
          updateData.assists = (player.assists || 0) + 1;
        } else if (eventType === 'Yellow Card') {
          updateData.yellowCards = (player.yellowCards || 0) + 1;
        } else if (eventType === 'Red Card') {
          updateData.redCards = (player.redCards || 0) + 1;
        }

        if (Object.keys(updateData).length > 0) {
          this.playerService.updatePlayer(playerId, updateData).catch(error => {
            console.error('Error updating player stats:', error);
          });
        }
      }

      // If there's an assistant, update their assists
      if (eventType === 'Goal' && assistantPlayerId) {
        const assistant = players.find(p => p.id === assistantPlayerId);
        if (assistant) {
          this.playerService.updatePlayer(assistantPlayerId, {
            assists: (assistant.assists || 0) + 1
          }).catch(error => {
            console.error('Error updating assistant stats:', error);
          });
        }
      }
    });
  }

  getPlayerName(playerId: string): string {
    // This is a simple implementation - in a real app, you'd use a map for performance
    return playerId;
  }

  clearRecentEvents(): void {
    this.recentEvents = [];
  }
}
