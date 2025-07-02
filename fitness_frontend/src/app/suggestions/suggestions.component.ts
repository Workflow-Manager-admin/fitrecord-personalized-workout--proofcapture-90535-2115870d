import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * SuggestionsComponent
 * Displays the latest personalized exercise plan for the user.
 * Whenever navigated to, fetches suggestions so data is always up-to-date after health data submission.
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

  /** Fetches latest personalized exercise suggestions based on latest submitted health data. */
  refreshSuggestions() {
    this.loading = true;
    this.errorMsg = '';
    this.routine = null;

    this.api.getSuggestions().subscribe({
      next: (res: any) => {
        this.routine = res;
        this.errorMsg = '';
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMsg = 'Could not load exercise suggestions: ' + (err?.message || 'Unknown error');
        this.loading = false;
      }
    });
  }
}
