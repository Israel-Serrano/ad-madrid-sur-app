import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../core/models/player.model';
import { PlayerService } from '../../core/services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { PlayerFormComponent } from '../player-form/player-form.component';
import { TeamService } from '../../core/services/team.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss']
})
export class ManagePlayersComponent implements OnInit {
  players$!: Observable<Player[]>;
  teams$!: Observable<any[]>;
  teamIdToNameMap: Map<string, string> = new Map();
  displayedColumns: string[] = ['name', 'teamName', 'goals', 'actions'];

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
    this.players$ = this.teams$.pipe(
      switchMap(teams => {
        teams.forEach(team => this.teamIdToNameMap.set(team.id, team.name));
        return this.playerService.getPlayers();
      })
    );
  }

  getTeamName(teamId: string): string {
    return this.teamIdToNameMap.get(teamId) || 'Unknown Team';
  }

  openDialog(player?: Player): void {
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '400px',
      data: { player, teams$: this.teams$ }
    });

    dialogRef.afterClosed().pipe(filter(result => !!result)).subscribe(result => {
      if (player) {
        this.playerService.updatePlayer(player.id, result);
      } else {
        this.playerService.createPlayer(result);
      }
    });
  }

  deletePlayer(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Jugador',
        message: '¿Estás seguro de que quieres eliminar a este jugador?'
      }
    });

    dialogRef.afterClosed().pipe(filter(result => result === true)).subscribe(() => {
      this.playerService.deletePlayer(id);
    });
  }
}
