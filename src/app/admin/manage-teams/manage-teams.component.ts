import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { Team } from '../../core/models/team.model';
import { TeamService } from '../../core/services/team.service';
import { UserService } from '../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamFormComponent } from '../team-form/team-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-manage-teams',
  templateUrl: './manage-teams.component.html',
  styleUrls: ['./manage-teams.component.scss']
})
export class ManageTeamsComponent implements OnInit {
  teams$!: Observable<Team[]>;
  displayedColumns: string[] = ['name', 'category', 'coaches', 'actions'];
  coachNameMap = new Map<string, string>();

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // First load coaches to build the name map
    this.userService.getUsersByRole('coach').subscribe((coaches: User[]) => {
      coaches.forEach(coach => {
        this.coachNameMap.set(coach.uid, coach.displayName || 'Sin nombre');
      });
    });
    
    this.teams$ = this.teamService.getTeams();
  }

  getCoachNames(coachIds: string[]): string {
    if (!coachIds || coachIds.length === 0) {
      return 'Sin entrenador';
    }
    return coachIds.map(id => this.coachNameMap.get(id) || 'Cargando...').join(', ');
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
        title: 'Eliminar Equipo',
        message: '¿Estás seguro de que quieres eliminar este equipo?'
      }
    });

    dialogRef.afterClosed().pipe(filter(result => result === true)).subscribe(() => {
      this.teamService.deleteTeam(id);
    });
  }
}
