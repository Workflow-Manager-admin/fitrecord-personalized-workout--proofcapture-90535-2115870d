import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidenav">
      <ul>
        <li [class.selected]="selected==='dashboard'" (click)="select('dashboard')">
          <span>Dashboard</span>
        </li>
        <li [class.selected]="selected==='data-entry'" (click)="select('data-entry')">
          <span>Body Data</span>
        </li>
        <li [class.selected]="selected==='exercises'" (click)="select('exercises')">
          <span>Exercises</span>
        </li>
        <li [class.selected]="selected==='upload'" (click)="select('upload')">
          <span>Upload Proof</span>
        </li>
      </ul>
    </aside>
  `,
  styles: [`
    .sidenav {
      min-width: 220px;
      height: 100%;
      background: #fff;
      border-right: 1px solid var(--border);
      padding-top: 2rem;
      box-sizing: border-box;
      box-shadow: var(--shadow);
    }
    ul { list-style: none; margin: 0; padding: 0; }
    li {
      margin-bottom: 1.2rem;
      padding: 0.8rem 1.4rem;
      cursor: pointer;
      font-size: 1.12rem;
      color: var(--secondary);
      border-radius: .9rem 0.9rem 0.9rem 0.9rem;
      transition: background .11s, color .11s;
      display: flex;
      align-items: center;
    }
    li.selected, li:hover  {
      background: var(--primary);
      color: var(--accent);
    }
  `]
})
export class SidenavComponent {
  @Input() selected: string = '';
  @Output() navSelect = new EventEmitter<string>();
  select(section: string) {
    this.navSelect.emit(section);
  }
}
