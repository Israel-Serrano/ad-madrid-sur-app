import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../core/models/player.model';
import { PlayerService } from '../../core/services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { PlayerFormComponent } from '../player-form/player-form.component';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss']
})
export class ManagePlayersComponent implements OnInit {
  players$!: Observable<Player[]>;
  displayedColumns: string[] = ['name', 'teamId', 'actions'];

  constructor(
    private playerService: PlayerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.players$ = this.playerService.getPlayers();
  }

  openDialog(player?: Player): void {
    const dialogRef = this.dialog.open(PlayerFormComponent, {
      width: '400px',
      data: { player }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (player) {
          this.playerService.updatePlayer(player.id, result);
        } else {
          this.playerService.createPlayer(result);
        }
      }
    });
  }

  deletePlayer(id: string): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.playerService.deletePlayer(id);
    }
  }
}
