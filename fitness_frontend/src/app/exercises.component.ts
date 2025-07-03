// PUBLIC_INTERFACE
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './shared/api.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" style="max-width:600px;">
      <h3>Your Personalized Exercise Plan</h3>
      <div *ngIf="loading">Loading plan...</div>
      <div *ngIf="!loading && error" class="form-error">{{error}}</div>
      <div *ngIf="!loading && exercisePlan">
        <ul style="padding-left:1em;">
          <li *ngFor="let ex of exercisePlan.exercises">
            <strong>{{ ex.name }}</strong> — {{ ex.reps }} reps
          </li>
        </ul>
        <div style="margin-top:1em; font-size:.99em; color:var(--secondary)">
          {{ exercisePlan.note }}
        </div>
      </div>
    </div>
  `,
  styles: [`.form-error { color: #f15a4a;}`]
})
export class ExercisesComponent {
  exercisePlan: any = null;
  error = '';
  loading = false;

  constructor(private api: ApiService) {
    this.ngOnInit();
  }
  async ngOnInit() {
    this.loading = true;
    try {
      // Use injected ApiService for fetching exercise plan
      this.exercisePlan = await this.api.getExercisePlan();
    } catch (e: any) {
      this.error = e?.error || e?.message || 'Failed to load plan.';
    }
    this.loading = false;
  }
}
