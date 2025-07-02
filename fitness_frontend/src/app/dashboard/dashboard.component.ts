import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

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
  suggestions: any = null;
  suggestionsError = '';
  fetchingSuggestions = false;

  // Move DI to function/local method scope for linter clean pass

  // PUBLIC_INTERFACE
  submit(): void {
    const api = inject(ApiService);

    this.message = '';
    this.errorMsg = '';
    this.suggestionsError = '';
    this.suggestions = null;

    if (this.height == null || this.weight == null) {
      this.errorMsg = 'Please provide both height and weight.';
      return;
    }
    this.loading = true;
    // Submit health data, then fetch suggestions immediately and display them inline
    api.submitHealthData(this.height, this.weight).subscribe({
      next: (): void => {
        this.message = 'Health data saved!';
        // Immediately fetch exercise suggestions
        this.fetchingSuggestions = true;
        api.getSuggestions().subscribe({
          next: (result: any): void => {
            this.fetchingSuggestions = false;
            this.suggestions = result;
            this.suggestionsError = '';
          },
          error: (err: any): void => {
            this.fetchingSuggestions = false;
            this.suggestionsError = 'Could not load exercise suggestions: ' + (err?.message || 'Unknown error');
          }
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
    const api = inject(ApiService);
    const router = inject(Router);
    api.logout();
    router.navigate(['/login']);
  }
}
