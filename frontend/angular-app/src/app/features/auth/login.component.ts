import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="card login-card">
        <div class="card-header">
          <div class="logo-box">OMS</div>
          <h2>Welcome back</h2>
          <p class="subtitle">Enter your credentials to access the system</p>
        </div>
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="username" name="username" required placeholder="e.g. admin" #user="ngModel">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••" #pass="ngModel">
          </div>
          <button type="submit" class="btn btn-primary login-btn" [disabled]="loading || !loginForm.valid">
            <span *ngIf="!loading">Sign in</span>
            <span *ngIf="loading">Signing in...</span>
          </button>
          <div *ngIf="error" class="error-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            {{error}}
          </div>
        </form>
        <div class="login-footer">
          <p>Admin: admin / admin123</p>
          <p>User: user / user123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: transparent; }
    .login-card { width: 100%; max-width: 400px; padding: 2.5rem; }
    .card-header { text-align: center; margin-bottom: 2rem; }
    .logo-box { background: #3b82f6; color: white; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; margin: 0 auto 1rem; font-weight: 800; font-size: 1.25rem; }
    h2 { margin-bottom: 0.5rem; font-size: 1.5rem; color: #1e293b; }
    .subtitle { color: #64748b; font-size: 0.875rem; }
    .login-btn { width: 100%; height: 42px; font-size: 1rem; margin-top: 1rem; }
    .error-box { display: flex; align-items: center; gap: 8px; color: #ef4444; background: #fef2f2; padding: 0.75rem; border-radius: 6px; margin-top: 1.5rem; font-size: 0.875rem; border: 1px solid #fee2e2; }
    .login-footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 0.75rem; text-align: center; line-height: 1.6; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Authentication failed';
        this.loading = false;
      }
    });
  }
}
