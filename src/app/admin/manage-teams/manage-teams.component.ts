import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Team } from '../../core/models/team.model';
import { TeamService } from '../../core/services/team.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamFormComponent } from '../team-form/team-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-teams',
  templateUrl: './manage-teams.component.html',
  styleUrls: ['./manage-teams.component.scss']
})
export class ManageTeamsComponent implements OnInit {
  teams$!: Observable<Team[]>;
  displayedColumns: string[] = ['name', 'category', 'actions'];

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
  }

  openDialog(team?: Team): void {
    const dialogRef = this.dialog.open(TeamFormComponent, {
      width: '400px',
      data: { team }
    });

    dialogRef.afterClosed().pipe(filter(result => !!result)).subscribe(result => {
      if (team) {
        // Update team
        this.teamService.updateTeam(team.id, result);
      } else {
        // Create team, initializing empty arrays for players and coaches
        const newTeam = { ...result, coachIds: [], playerIds: [] };
        this.teamService.createTeam(newTeam);
      }
    });
  }

  deleteTeam(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Team',
        message: 'Are you sure you want to delete this team?'
      }
    });

    dialogRef.afterClosed().pipe(filter(result => result === true)).subscribe(() => {
      this.teamService.deleteTeam(id);
    });
  }
}
