import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

/**
 * Dashboard page for entering height/weight, saving health data, and
 * routing to exercise suggestions upon successful save.
 */
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
  message = '';
  loading = false;
  errorMsg = '';

  // PUBLIC_INTERFACE
  submit(): void {
    const api = inject(ApiService);
    const router = inject(Router);

    this.message = '';
    this.errorMsg = '';

    if (this.height == null || this.weight == null) {
      this.errorMsg = 'Please provide both height and weight.';
      return;
    }
    this.loading = true;

    api.submitHealthData(this.height, this.weight).subscribe({
      next: (): void => {
        // After saving health data, automatically go to suggestions page to see personalized plan.
        router.navigate(['/suggestions']);
      },
      error: (err: any): void => {
        this.loading = false;
        this.errorMsg = err?.message || 'Failed to submit health data.';
      },
      complete: (): void => {
        this.loading = false;
      }
    });
  }

  // PUBLIC_INTERFACE
  logout(): void {
    const api = inject(ApiService);
    const router = inject(Router);
    api.logout();
    router.navigate(['/login']);
  }
}
