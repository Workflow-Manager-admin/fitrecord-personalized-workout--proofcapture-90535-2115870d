import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-title">fitRecord</div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 58px;
      background: var(--background);
      border-bottom: 1px solid var(--border);
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.5vw;
      position: sticky;
      top: 0;
      z-index: 5;
    }
    .navbar-title {
      font-size: 1.44rem;
      font-weight: 700;
      color: var(--secondary);
      letter-spacing: 1px;
    }
  `]
})
export class NavbarComponent {}
