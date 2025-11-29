import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { PlayerFormComponent } from 'src/app/admin/player-form/player-form.component';
import { Team } from 'src/app/core/models/team.model';
import { Player } from 'src/app/core/models/player.model';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { PlayerService } from 'src/app/core/services/player.service';
import { TeamService } from 'src/app/core/services/team.service';
import { ConfirmDialogComponent } from 'src/app/admin/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {

  teams$: Observable<Team[]> = of([]);
  playersByTeam: { [teamId: string]: Observable<Player[]> } = {};
  displayedColumns: string[] = ['name', 'dorsal', 'actions'];

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.teams$ = this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.teamService.getTeamsForCoach(user.uid);
        } else {
          return of([]);
        }
      })
    );
  }

  loadPlayersForTeam(teamId: string): void {
    if (!this.playersByTeam[teamId]) {
      this.playersByTeam[teamId] = this.playerService.getPlayersByTeam(teamId);
    }
  }

  openPlayerForm(teamId: string, player?: Player): void {
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '400px',
      data: { player: player, teamId: teamId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // This will refresh the players list after a player is added/edited
        this.playersByTeam[teamId] = this.playerService.getPlayersByTeam(teamId);
      }
    });
  }

  deletePlayer(playerId: string, teamId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que quieres eliminar a este jugador?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playerService.deletePlayer(playerId).then(() => {
          console.log('Jugador eliminado');
          // This will refresh the players list after a player is deleted
          this.playersByTeam[teamId] = this.playerService.getPlayersByTeam(teamId);
        });
      }
    });
  }
}
