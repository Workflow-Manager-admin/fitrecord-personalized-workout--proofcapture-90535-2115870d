import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  loading = true;
  errorMsg = '';
  workouts: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getHistory().subscribe({
      next: res => {
        this.workouts = res?.history || res || [];
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err?.message || 'Failed to load history';
        this.loading = false;
      }
    });
  }
}
