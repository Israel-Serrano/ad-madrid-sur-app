import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachDashboardComponent } from './coach-dashboard/coach-dashboard.component';
import { MyTeamsComponent } from './my-teams/my-teams.component';
import { LogEventComponent } from './log-event/log-event.component';

const routes: Routes = [
  {
    path: '',
    component: CoachDashboardComponent,
    children: [
      { path: 'my-teams', component: MyTeamsComponent },
      { path: 'log-event', component: LogEventComponent },
      { path: '', redirectTo: 'my-teams', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachRoutingModule { }
