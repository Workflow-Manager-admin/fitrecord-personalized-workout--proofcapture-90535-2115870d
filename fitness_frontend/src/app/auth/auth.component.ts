import { Component } from '@angular/core';
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

  // No constructor required since no DI services are actually referenced.

  onSubmit(): void {
    // Implementation must be updated if ApiService/router needed.
    // Placeholder to avoid linter error on empty method.
    void this.mode;
  }

  switchMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMsg = '';
  }
}
