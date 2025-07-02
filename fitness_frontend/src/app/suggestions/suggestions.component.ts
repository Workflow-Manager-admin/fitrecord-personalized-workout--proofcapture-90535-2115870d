import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * SuggestionsComponent
 * Displays the latest personalized exercise plan for the user.
 * Whenever navigated to, fetches suggestions so data is always up-to-date after health data submission.
 * Handles backend/network/4xx/5xx/empty result errors gracefully and displays helpful messages.
 */
// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent {
  loading = true;
  errorMsg = '';
  routine: any = null;
  private api = inject(ApiService);
  private router = inject(Router);

  constructor() {
    // Subscribe to router events so when the user routes to /suggestions,
    // fetch the latest suggestions. (Works for both direct navigation and redirect from dashboard.)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.refreshSuggestions());
    // Also fetch on component creation (for browser refresh/direct load).
    this.refreshSuggestions();
  }

  /**
   * PUBLIC_INTERFACE
   * Fetches latest personalized exercise suggestions based on latest submitted health data.
   * Shows user-friendly error if backend/network error or empty result.
   */
  refreshSuggestions() {
    this.loading = true;
    this.errorMsg = '';
    this.routine = null;

    this.api.getSuggestions().subscribe({
      next: (res: any) => {
        // Consider null, empty object/array, or status fields as "no result"
        if (
          !res ||
          (Array.isArray(res) && res.length === 0) ||
          (typeof res === 'object' && Object.keys(res).length === 0)
        ) {
          this.errorMsg = 'No exercise suggestions found for the provided data.';
          this.routine = null;
        } else if (res.error || res.status === 'error' || res.statusCode >= 400) {
          // Some APIs can wrap error in response body even on 200 OK
          this.errorMsg = res.message || 'Could not fetch exercises. Please try again later.';
          this.routine = null;
        } else {
          this.routine = res;
          this.errorMsg = '';
        }
        this.loading = false;
      },
      error: (err: any) => {
        if (err && err.status === 404) {
          this.errorMsg = 'No exercise suggestions found for the provided data.';
        } else if (err && (err.status === 0 || err.status >= 500)) {
          // 0 = network error, >=500 = server
          this.errorMsg = 'Could not fetch exercises. Please try again later.';
        } else if (err && err.error && typeof err.error === 'string') {
          this.errorMsg = err.error;
        } else if (err && err.message) {
          this.errorMsg = 'Could not fetch exercises: ' + err.message;
        } else {
          this.errorMsg = 'Could not fetch exercises. Please try again later.';
        }
        this.routine = null;
        this.loading = false;
      }
    });
  }
}
