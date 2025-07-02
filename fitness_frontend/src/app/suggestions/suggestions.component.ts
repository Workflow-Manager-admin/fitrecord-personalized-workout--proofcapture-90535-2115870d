import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent implements OnInit {
  loading = true;
  errorMsg = '';
  routine: any = null;

  /**
   * On init, fetch the personalized exercise suggestions from backend API.
   * This uses the user's latest submitted height and weight.
   */
  ngOnInit(): void {
    const api = inject(ApiService);
    this.loading = true;
    this.errorMsg = '';
    this.routine = null;

    api.getSuggestions().subscribe({
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
