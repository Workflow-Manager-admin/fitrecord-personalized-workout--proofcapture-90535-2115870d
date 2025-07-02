import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
    title: 'Login or Register'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    title: 'User Dashboard'
  },
  {
    path: 'suggestions',
    loadComponent: () => import('./suggestions/suggestions.component').then(m => m.SuggestionsComponent),
    canActivate: [AuthGuard],
    title: 'Exercise Suggestions'
  },
  {
    path: 'upload',
    loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent),
    canActivate: [AuthGuard],
    title: 'Upload Workout Proof'
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent),
    canActivate: [AuthGuard],
    title: 'Workout History'
  },
  {
    path: 'health',
    loadComponent: () => import('./health/health.component').then(m => m.HealthComponent),
    title: 'Database Health'
  },
  { path: '**', redirectTo: 'dashboard' }
]
