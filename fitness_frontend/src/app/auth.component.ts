import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './shared/api.service';
import { getBrowser } from './shared/ssr-utils';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card auth-card">
      <h2 *ngIf="mode==='login'">Login</h2>
      <h2 *ngIf="mode==='register'">Sign Up</h2>
      <form (ngSubmit)="onSubmit()" [attr.autocomplete]="'off'">
        <input type="text" placeholder="Username" [(ngModel)]="username" name="username" required />
        <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required />
        <ng-container *ngIf="mode==='register'">
          <input type="password" placeholder="Confirm Password" [(ngModel)]="confirm" name="confirm" required />
        </ng-container>
        <div *ngIf="error" class="form-error">{{ error }}</div>
        <button [disabled]="loading">{{ mode==='login' ? 'Login' : 'Register' }}</button>
      </form>
      <div class="auth-footer">
        <span *ngIf="mode==='login'">Don't have an account?</span>
        <span *ngIf="mode==='register'">Already have an account?</span>
        <a (click)="toggleMode()">
          {{ mode==='login' ? 'Sign up' : 'Login' }}
        </a>
      </div>
    </div>
  `,
  styles: [`
    .auth-card { min-width: 310px; max-width: 340px;}
    form {
      display: flex; flex-direction: column;
      gap: 0.3rem; margin-bottom: .8rem;
    }
    .form-error { color: #f15a4a; margin-bottom: 1rem;}
    .auth-footer { display: flex; justify-content: center; font-size: .97rem;}
    .auth-footer a { color: var(--accent); margin-left: .45em; cursor: pointer;}
  `]
})
export class AuthComponent {
  @Output() authenticated = new EventEmitter<void>();
  mode: 'login' | 'register' = 'login';
  username = '';
  password = '';
  confirm = '';
  error = '';
  loading = false;

  constructor(private api: ApiService) { void this.api; } // prevent unused var linter error

  toggleMode() {
    this.error = '';
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      if (this.mode === 'login') {
        const resp = await this.api.login(this.username, this.password);
        if (resp && resp.token) {
          const browser = getBrowser();
          if (browser && browser.localStorage) {
            browser.localStorage.setItem('token', resp.token);
          }
          this.authenticated.emit();
        } else {
          this.error = 'Login failed. Please check credentials.';
        }
      } else {
        if (this.password !== this.confirm) {
          this.error = 'Passwords do not match.'; this.loading = false; return;
        }
        const resp = await this.api.register(this.username, this.password);
        if (resp && resp.success) {
          this.mode = 'login';
        } else {
          this.error = resp?.message || 'Registration failed.';
        }
      }
    } catch (e: any) {
      this.error = e?.error || e?.message || 'An error occurred.';
    }
    this.loading = false;
  }
}
