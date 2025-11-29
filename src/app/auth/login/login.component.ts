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
      await this.authService.login(email, password);
      
      // Get current user and redirect based on role
      this.authService.currentUser$.pipe(take(1)).subscribe(user => {
        if (user) {
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'coach') {
            this.router.navigate(['/coach']);
          } else {
            this.router.navigate(['/public']);
          }
        }
        this.loading = false;
      });
    } catch (error: any) {
      this.errorMessage = 'Inicio de sesión fallido. Verifica tus credenciales.';
      this.loading = false;
      console.error(error);
    }
  }
}