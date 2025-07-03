import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getBrowser } from './shared/ssr-utils';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-title">fitRecord</div>
      <button *ngIf="showLogout()" (click)="logout.emit()" class="logout-btn">Logout</button>
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
    .logout-btn {
      font-size: 1rem;
      font-weight: 500;
      padding: 0.5rem 1.2rem;
      border-radius: .7rem;
      background: var(--accent);
      color: #fff;
      border: none;
      box-shadow: none;
      transition: filter 0.1s;
    }
    .logout-btn:hover { filter: brightness(1.09);}
  `]
})
export class NavbarComponent {
  @Output() logout = new EventEmitter<void>();
  showLogout() {
    const browser = getBrowser();
    return !!(browser && browser.localStorage && browser.localStorage.getItem('token'));
  }
}
