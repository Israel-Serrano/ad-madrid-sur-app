import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { take } from 'rxjs/operators';

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
      console.log('🔐 Starting login for:', email);
      await this.authService.login(email, password);
      console.log('✅ Auth successful, waiting for user profile...');
      
      // Get current user and redirect based on role
      this.authService.currentUser$.pipe(take(1)).subscribe(
        user => {
          console.log('👤 User profile received:', user);
          if (user) {
            if (user.role === 'admin') {
              console.log('→ Redirecting to admin');
              this.router.navigate(['/admin']);
            } else if (user.role === 'coach') {
              console.log('→ Redirecting to coach');
              this.router.navigate(['/coach']);
            } else {
              console.log('→ Redirecting to public');
              this.router.navigate(['/public']);
            }
          } else {
            console.error('❌ No user profile found');
            this.errorMessage = 'No se pudo cargar el perfil de usuario.';
          }
          this.loading = false;
        },
        error => {
          console.error('❌ Error:', error);
          this.errorMessage = 'Error al cargar el perfil. Intenta de nuevo.';
          this.loading = false;
        }
      );
    } catch (error: any) {
      console.error('❌ Login error:', error);
      this.errorMessage = 'Inicio de sesión fallido. Verifica tus credenciales.';
      this.loading = false;
    }
  }
}