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
    <div class="login-container">
      <h2>OMS Login</h2>
      <form (ngSubmit)="onLogin()">
        <div class="form-group">
          <label>Username</label>
          <input type="text" [(ngModel)]="username" name="username" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit" [disabled]="loading">Login</button>
        <div *ngIf="error" class="error">{{error}}</div>
      </form>
    </div>
  `,
  styles: [`
    .login-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
    .error { color: red; margin-top: 10px; }
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
        this.error = err.error?.detail || 'Login failed';
        this.loading = false;
      }
    });
  }
}
