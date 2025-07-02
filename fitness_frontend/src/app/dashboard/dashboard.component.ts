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

  private api = inject(ApiService);
  private router = inject(Router);

  // PUBLIC_INTERFACE
  /**
   * Submit health data, then route to exercise plan with forced reload.
   * Ensures /suggestions displays exercises for immediately updated input.
   */
  submit(): void {
    this.message = '';
    this.errorMsg = '';

    if (this.height == null || this.weight == null) {
      this.errorMsg = 'Please provide both height and weight.';
      return;
    }
    this.loading = true;

    this.api.submitHealthData(this.height, this.weight).subscribe({
      next: (): void => {
        // Store last submitted height/weight to localStorage for suggestions
        try {
          if (typeof window !== 'undefined' && globalThis.window && globalThis.window.localStorage) {
            globalThis.window.localStorage.setItem('lastSubmittedHeight', String(this.height));
            globalThis.window.localStorage.setItem('lastSubmittedWeight', String(this.weight));
          }
        } catch {
          // Intentionally empty: localStorage may not be available, safe to ignore.
        }
        // After saving health data, go to /suggestions AND force component reload.
        // Route to /suggestions using a unique state to hint for forced refresh.
        // This is a robust workaround for Angular's route reuse quirks.
        this.router.navigate(['/suggestions'], {
          // random dummy param to "bump" NavigationEnd (optional, for robust reload)
          state: { afterHealthSaved: true, ts: Date.now() }
        });
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
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
