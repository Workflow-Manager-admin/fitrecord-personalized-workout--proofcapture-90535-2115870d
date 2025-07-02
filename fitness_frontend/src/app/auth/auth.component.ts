import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.errorMsg = '';
    const obs = this.mode === 'login'
      ? this.api.login(this.email, this.password)
      : this.api.register(this.email, this.password);

    obs.subscribe({
      next: (result) => {
        if (result.token) {
          this.api.setToken(result.token);
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: (e) => {
        this.errorMsg = e?.message || 'Login/Register failed';
        this.loading = false;
      }
    });
  }

  switchMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMsg = '';
  }
}
