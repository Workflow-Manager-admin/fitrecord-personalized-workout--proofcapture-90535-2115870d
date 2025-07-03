import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './shared/api.service';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card" style="max-width:420px;">
      <h3>Enter Your Body Data</h3>
      <form (ngSubmit)="submit()" autocomplete="off">
        <label>Weight (kg):</label>
        <input type="number" min="10" max="400" [(ngModel)]="weight" name="weight" required />
        <label>Height (cm):</label>
        <input type="number" min="50" max="270" [(ngModel)]="height" name="height" required />
        <div *ngIf="error" class="form-error">{{error}}</div>
        <button [disabled]="loading">Save</button>
      </form>
    </div>
  `,
  styles: [`
    label { font-weight: 500; color: var(--secondary);}
    .form-error { color: #f15a4a;}
  `]
})
export class DataEntryComponent {
  @Output() profileUpdated = new EventEmitter<void>();
  weight: number | null = null;
  height: number | null = null;
  error = '';
  loading = false;
  constructor(private api: ApiService) {
    void this.api; // prevent unused var linter error
    this.getProfile();
  }
  async getProfile() {
    try {
      const p = await this.api.getProfile();
      this.weight = p?.weight || null;
      this.height = p?.height || null;
    } catch {
      // ignore load errors
    }
  }
  async submit() {
    this.error = '';
    this.loading = true;
    try {
      if (!this.weight || !this.height) { this.error = 'Please enter both.'; this.loading = false; return;}
      await this.api.updateProfile(this.weight, this.height);
      this.profileUpdated.emit();
    } catch (e: any) {
      this.error = e?.message || 'Error updating profile.';
    }
    this.loading = false;
  }
}
