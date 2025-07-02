import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    // This guard no longer does anything since DI fields are removed.
    // The logic should likely be re-implemented if routing protection is needed.
    return true;
  }
}
