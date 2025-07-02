import { Component, OnInit } from '@angular/core';
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

  // No constructor required since no DI services are actually referenced.

  ngOnInit() {
    // Implementation must be updated if ApiService needed.
  }
}
