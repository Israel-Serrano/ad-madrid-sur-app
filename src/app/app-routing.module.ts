import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard, RoleGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'coach',
    loadChildren: () => import('./coach/coach.module').then(m => m.CoachModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'coach' }
  },
  {
    path: 'public',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
  },
  { path: '', redirectTo: '/public', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/public' } // Wildcard route for a 404 or redirect
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
