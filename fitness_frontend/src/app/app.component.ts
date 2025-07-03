import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar.component';
import { SidenavComponent } from './sidenav.component';
import { AuthComponent } from './auth.component';
import { DataEntryComponent } from './data-entry.component';
import { ExercisesComponent } from './exercises.component';
import { ProofUploadComponent } from './proof-upload.component';
import { DashboardComponent } from './dashboard.component';
import { getBrowser } from './shared/ssr-utils';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    SidenavComponent,
    AuthComponent,
    DataEntryComponent,
    ExercisesComponent,
    ProofUploadComponent,
    DashboardComponent
  ],
  template: `
    <div class="main-layout">
      <app-navbar (logout)="onLogout()"></app-navbar>
      <div class="body-container" *ngIf="loggedIn; else authBlock">
        <div class="sidenav-container">
          <app-sidenav
            [selected]="activeSection"
            (navSelect)="onNavSelect($event)"
          ></app-sidenav>
        </div>
        <div class="main-content">
          <ng-container [ngSwitch]="activeSection">
            <app-dashboard *ngSwitchCase="'dashboard'"></app-dashboard>
            <app-data-entry *ngSwitchCase="'data-entry'" (profileUpdated)="onProfileUpdated()"></app-data-entry>
            <app-exercises *ngSwitchCase="'exercises'"></app-exercises>
            <app-proof-upload *ngSwitchCase="'upload'"></app-proof-upload>
          </ng-container>
        </div>
      </div>
      <ng-template #authBlock>
        <div class="auth-content">
          <app-auth (authenticated)="onAuth()"></app-auth>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn = false;
  activeSection: 'dashboard' | 'data-entry' | 'exercises' | 'upload' = 'dashboard';

  onAuth() {
    this.loggedIn = true;
    this.activeSection = 'dashboard';
  }

  onLogout() {
    const browser = getBrowser();
    if (browser && browser.localStorage) {
      browser.localStorage.clear();
    }
    this.loggedIn = false;
    this.activeSection = 'dashboard';
  }

  onNavSelect(section: any) {
    this.activeSection = section;
  }

  onProfileUpdated() {
    // Optionally refresh exercise suggestions/dashboard after weight/height update
  }
}
