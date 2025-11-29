import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageTeamsComponent } from './manage-teams/manage-teams.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagePlayersComponent } from './manage-players/manage-players.component';
import { PlayerFormComponent } from './player-form/player-form.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { LoadSeedComponent } from '../core/helpers/load-seed.component';
import { HasRoleDirective } from '../core/directives/has-role.directive';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion } from '@angular/material/expansion';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageTeamsComponent,
    TeamFormComponent,
    ManagePlayersComponent,
    PlayerFormComponent,
    ManageUsersComponent,
    UserFormComponent,
    ConfirmDialogComponent,
    LoadSeedComponent,
    HasRoleDirective
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class AdminModule { }
