import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSuggestions().subscribe({
      next: data => {
        this.routine = data?.routine || data;
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err?.message || 'Failed to load routine.';
        this.loading = false;
      }
    });
  }
}
