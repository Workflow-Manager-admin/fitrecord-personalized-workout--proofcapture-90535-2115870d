import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  height: number | null = null;
  weight: number | null = null;
  message: string = '';
  loading = false;
  errorMsg = '';

  // No constructor required since no DI services are actually referenced.

  submit() {
    // Implementation must be updated if ApiService/router needed.
  }

  logout() {
    // Implementation must be updated if ApiService/router needed.
  }
}
