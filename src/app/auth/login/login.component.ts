import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

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
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      // Navigate to a protected route after successful login, e.g., an admin dashboard
      this.router.navigate(['/admin']); 
    } catch (error: any) {
      this.errorMessage = 'Login failed. Please check your credentials.';
      console.error(error);
    }
  }
}