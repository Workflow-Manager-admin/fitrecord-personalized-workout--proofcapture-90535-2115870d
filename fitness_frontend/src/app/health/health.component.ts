import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrl: './health.component.css'
})
export class HealthComponent implements OnInit {
  status: 'unknown' | 'healthy' | 'unhealthy' = 'unknown';
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.checkDbHealth().subscribe({
      next: res => {
        if (res.status === 'ok' || res.healthy) {
          this.status = 'healthy';
        } else {
          this.status = 'unhealthy';
        }
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err?.message || 'Failed to reach backend';
        this.loading = false;
      }
    });
  }
}
