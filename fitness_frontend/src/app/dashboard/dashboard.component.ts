import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service'; // Import ApiService
import { Router } from '@angular/router';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [ApiService]
})
export class DashboardComponent {
  height: number | null = null;
  weight: number | null = null;
  message: string = '';
  loading = false;
  errorMsg = '';
  suggestions: any = null;
  suggestionsError: string = '';
  fetchingSuggestions = false;

  constructor(public api: ApiService, public router: Router) {
    // Reference properties to satisfy linter (no-unused-vars)
    void api;
    void router;
  }

  // PUBLIC_INTERFACE
  submit() {
    this.message = '';
    this.errorMsg = '';
    this.suggestionsError = '';
    this.suggestions = null;

    if (!this.height || !this.weight) {
      this.errorMsg = 'Please provide both height and weight.';
      return;
    }

    this.loading = true;
    // Submit health data, then fetch suggestions immediately and display them inline
    this.api.submitHealthData(this.height, this.weight).subscribe({
      next: () => {
        this.message = 'Health data saved!';
        // Immediately fetch exercise suggestions
        this.fetchingSuggestions = true;
        this.api.getSuggestions().subscribe({
          next: (result) => {
            this.fetchingSuggestions = false;
            this.suggestions = result;
            this.suggestionsError = '';
          },
          error: (err) => {
            this.fetchingSuggestions = false;
            this.suggestionsError = 'Could not load exercise suggestions: ' + (err?.message || 'Unknown error');
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.message || 'Failed to submit health data.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // PUBLIC_INTERFACE
  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
