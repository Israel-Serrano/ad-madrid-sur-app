import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ManageTeamsComponent } from './manage-teams/manage-teams.component';
import { ManagePlayersComponent } from './manage-players/manage-players.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'teams', component: ManageTeamsComponent },
      { path: 'players', component: ManagePlayersComponent },
      { path: 'users', component: ManageUsersComponent },
      // other admin routes can be added here
      { path: '', redirectTo: 'teams', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
