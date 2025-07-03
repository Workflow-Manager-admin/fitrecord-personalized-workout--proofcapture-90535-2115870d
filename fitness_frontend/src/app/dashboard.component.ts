import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './shared/api.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" style="max-width:640px;">
      <h3>Workout History</h3>
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="!loading && error" class="form-error">{{error}}</div>
      <div *ngIf="!loading && workouts && workouts.length">
        <ul>
          <li *ngFor="let w of workouts">
            <span>Date: {{ w.date | date:'mediumDate' }} - </span>
            <span>{{ w.exercise }}</span>
            <a *ngIf="w.videoUrl" [href]="w.videoUrl" target="_blank" style="margin-left:1em;color:var(--accent);font-size:.97em">Watch Proof</a>
          </li>
        </ul>
      </div>
      <div *ngIf="!loading && workouts && !workouts.length">
        <em>No workout proofs uploaded yet. Start recording and uploading your first!</em>
      </div>
    </div>
  `,
  styles: [`.form-error{color:#f15a4a;}`]
})
export class DashboardComponent {
  loading = false;
  workouts: any[] = [];
  error = '';

  constructor(private api: ApiService) {
    this.ngOnInit();
  }

  async ngOnInit() {
    this.loading = true;
    try {
      // Use injected ApiService for fetching data
      this.workouts = await this.api.getWorkoutHistory();
    } catch (e: any) {
      this.error = e?.error || e?.message || 'Failed to load workout history';
    }
    this.loading = false;
  }
}
