import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss']
})
export class CoachDashboardComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  logout(): void {
    this.authService.logout().then(() => {
      this.snackBar.open('Sesión cerrada correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/login']);
    }).catch(error => {
      this.snackBar.open('Error al cerrar sesión', 'Cerrar', { duration: 3000 });
      console.error('Logout error:', error);
    });
  }
}
