import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ApiService {
  /** All backend API requests use this base URL. Adjust if needed. */
  private readonly apiBase = 'http://localhost:3001';

  constructor() {}

  /** PUBLIC_INTERFACE: Registers a new user with the backend. */
  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/auth/register`, { email, password });
  }

  /** PUBLIC_INTERFACE: Logs in the user & gets JWT token. */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/auth/login`, { email, password });
  }

  /** PUBLIC_INTERFACE: Returns JWT from localStorage, or null. */
  getToken(): string | null {
    try {
      return typeof window !== 'undefined' && globalThis.window && globalThis.window.localStorage
        ? globalThis.window.localStorage.getItem('jwt')
        : null;
    } catch {
      return null;
    }
  }

  /** PUBLIC_INTERFACE: Stores JWT securely. */
  setToken(token: string): void {
    try {
      if (typeof window !== 'undefined' && globalThis.window && globalThis.window.localStorage) {
        globalThis.window.localStorage.setItem('jwt', token);
      }
    } catch {
      // do nothing
    }
  }

  /** PUBLIC_INTERFACE: Logs out and clears token. */
  logout(): void {
    try {
      if (typeof window !== 'undefined' && globalThis.window && globalThis.window.localStorage) {
        globalThis.window.localStorage.removeItem('jwt');
      }
    } catch {
      // do nothing
    }
  }

  /** PUBLIC_INTERFACE: Returns HTTP headers with JWT if logged in. */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  /** PUBLIC_INTERFACE: Submits user height and weight. */
  submitHealthData(height: number, weight: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiBase}/user/health`,
      { height, weight },
      { headers: this.getAuthHeaders() }
    );
  }

  /** PUBLIC_INTERFACE: Gets personalized exercise suggestions for user. */
  getSuggestions(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/exercise/suggestion`, { headers: this.getAuthHeaders() });
  }

  /** PUBLIC_INTERFACE: Uploads workout proof (image or video). */
  uploadWorkoutProof(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('proof', file);
    let headers = this.getAuthHeaders();
    headers = headers.delete('Content-Type');
    return this.http.post<any>(
      `${this.apiBase}/workout/upload`,
      formData,
      { headers }
    );
  }

  /** PUBLIC_INTERFACE: Gets user's workout history. */
  getHistory(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/user/history`, { headers: this.getAuthHeaders() });
  }

  /** PUBLIC_INTERFACE: Checks backend DB health status. */
  checkDbHealth(): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/health/db`);
  }

  /** Handles errors from API calls. */
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent)
      return throwError(() => new Error(error.error.message));
    return throwError(() => new Error(error.error?.message || error.statusText || 'API error'));
  }
}
