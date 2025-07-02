import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
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

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    if (!this.height || !this.weight) return;
    this.loading = true;
    this.errorMsg = '';
    this.api.submitHealthData(this.height, this.weight).subscribe({
      next: () => {
        this.message = 'Health data saved.';
        this.loading = false;
      },
      error: (e) => {
        this.errorMsg = e?.message || 'Could not save data.';
        this.loading = false;
      }
    });
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
