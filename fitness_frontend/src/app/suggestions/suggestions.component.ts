import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * SuggestionsComponent
 * Displays the latest personalized exercise plan for the user.
 * Whenever navigated to, fetches suggestions so data is always up-to-date after health data submission.
 * Matches backend contract: POSTs height/weight payload if present (from localStorage after dashboard submit).
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
  height: number | null = null;
  weight: number | null = null;
  private api = inject(ApiService);
  private router = inject(Router);

  constructor() {
    // Reload suggestions every time this route is entered.
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.refreshSuggestions();
      });
    // Also fetch once when component is constructed (browser refresh/direct entry).
    this.refreshSuggestions();
  }

  /**
   * PUBLIC_INTERFACE
   * Fetches health data from localStorage if present.
   */
  getLocalHealthData(): { height: number | null; weight: number | null } {
    try {
      const heightStr = typeof window !== 'undefined' && globalThis.window && globalThis.window.localStorage
        ? globalThis.window.localStorage.getItem('lastSubmittedHeight')
        : null;
      const weightStr = typeof window !== 'undefined' && globalThis.window && globalThis.window.localStorage
        ? globalThis.window.localStorage.getItem('lastSubmittedWeight')
        : null;
      return {
        height: heightStr ? Number(heightStr) : null,
        weight: weightStr ? Number(weightStr) : null
      };
    } catch {
      return { height: null, weight: null };
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Fetches latest personalized exercise suggestions based on latest submitted health data.
   * Shows user-friendly error if backend/network error or empty result.
   * Ensures the payload sent matches backend contract (POST with height/weight, not GET).
   */
  refreshSuggestions() {
    this.loading = true;
    this.errorMsg = '';
    this.routine = null;

    // Get height/weight from storage or null
    const data = this.getLocalHealthData();
    this.height = data.height;
    this.weight = data.weight;

    // If height/weight are not present, show error before making backend call.
    if (!this.height || !this.weight) {
      this.errorMsg = 'Please enter your height and weight in the dashboard first.';
      this.loading = false;
      return;
    }

    // Call the correct backend endpoint with required payload (POST /exercise/suggestion with {height, weight})
    this.api.getSuggestionsWithPayload(this.height, this.weight).subscribe({
      next: (res: any) => {
        if (
          !res ||
          (Array.isArray(res) && res.length === 0) ||
          (typeof res === 'object' && Object.keys(res).length === 0)
        ) {
          this.errorMsg = 'No exercise suggestions found for the provided data.';
          this.routine = null;
        } else if (res.error || res.status === 'error' || res.statusCode >= 400) {
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
