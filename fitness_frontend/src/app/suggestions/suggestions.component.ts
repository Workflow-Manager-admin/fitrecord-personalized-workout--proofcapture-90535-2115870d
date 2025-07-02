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
    if (
      this.height === null || this.height === undefined || Number.isNaN(+this.height) || +this.height < 30 || +this.height > 300 ||
      this.weight === null || this.weight === undefined || Number.isNaN(+this.weight) || +this.weight < 10 || +this.weight > 400
    ) {
      this.errorMsg = 'Please enter your height and weight in the dashboard first.';
      this.loading = false;
      return;
    }

    // --------- Enhanced debug & error logging ---------
    const debugPayload = { height: this.height, weight: this.weight };
    let debugHeaders: any = {};
    try {
      debugHeaders = this.api.getAuthHeaders();
    } catch (err) {
      console.warn('Could not get auth headers:', err);
    }
    const debugEndpoint = (this.api as any).apiBase
      ? ((this.api as any).apiBase + '/exercise/suggestion')
      : 'POST /exercise/suggestion';

    // Detailed log before request
    // eslint-disable-next-line no-console
    console.log('[SuggestionsComponent] Outgoing request to exercise suggestion API', {
      method: 'POST',
      endpoint: debugEndpoint,
      payload: debugPayload,
      headers: debugHeaders,
    });

    // Issue the backend call
    this.api.getSuggestionsWithPayload(this.height, this.weight).subscribe({
      next: (res: any) => {
        // Full response debug log
        // eslint-disable-next-line no-console
        console.log('[SuggestionsComponent] Response from /exercise/suggestion:', res);
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
        // Capture and log the outgoing request and the full error object from backend
        // eslint-disable-next-line no-console
        console.error('[SuggestionsComponent] Error response from /exercise/suggestion:', {
          endpoint: debugEndpoint,
          payload: debugPayload,
          headers: debugHeaders,
          errorObj: err,
          status: err?.status,
          backendMessage: err?.error?.message || err?.error || err?.message,
        });

        // Also display the backend's error to the user, if present
        let backendError = '';
        if (err && typeof err.error === 'object' && err.error && err.error.message) {
          backendError = err.error.message;
        } else if (err && typeof err.error === 'string') {
          backendError = err.error;
        } else if (err && err.message) {
          backendError = err.message;
        }
        if (err && err.status === 404) {
          this.errorMsg = backendError || 'No exercise suggestions found for the provided data.';
        } else if (err && (err.status === 0 || err.status >= 500)) {
          this.errorMsg = backendError || 'Could not fetch exercises. Please try again later.';
        } else if (backendError) {
          this.errorMsg = 'Could not fetch exercises: ' + backendError;
        } else {
          this.errorMsg = 'Could not fetch exercises. Please try again later.';
        }
        this.routine = null;
        this.loading = false;
      }
    });
  }
}
