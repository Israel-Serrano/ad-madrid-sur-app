import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../../core/models/team.model';
import { TeamService } from '../../core/services/team.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamFormComponent } from '../team-form/team-form.component';

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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (team) {
          // Update team
          this.teamService.updateTeam(team.id, result);
        } else {
          // Create team
          this.teamService.createTeam(result);
        }
      }
    });
  }

  deleteTeam(id: string): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.teamService.deleteTeam(id);
    }
  }
}

