import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { take, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.loading = true;
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      
      // Get current user and redirect based on role (with timeout)
      this.authService.currentUser$.pipe(
        take(1),
        timeout(5000) // Wait max 5 seconds
      ).subscribe(
        user => {
          if (user) {
            if (user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (user.role === 'coach') {
              this.router.navigate(['/coach']);
            } else {
              // Fallback for unknown roles
              this.router.navigate(['/public']);
            }
          } else {
            this.errorMessage = 'No se pudo cargar el perfil de usuario.';
          }
          this.loading = false;
        },
        (error: any) => {
          console.error('Error waiting for user:', error);
          this.errorMessage = 'Timeout al cargar el usuario. Recargando...';
          this.loading = false;
          setTimeout(() => location.reload(), 1500);
        }
      );
    } catch (error: any) {
      this.errorMessage = 'Inicio de sesión fallido. Verifica tus credenciales.';
      this.loading = false;
      console.error(error);
    }
  }
}