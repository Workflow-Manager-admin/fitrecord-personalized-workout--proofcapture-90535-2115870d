import { Injectable } from '@angular/core';

// PUBLIC_INTERFACE
import { getBrowser } from './ssr-utils';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private backendUrl = 'http://localhost:3001/api'; // TODO: adjust in production

  private getHeaders(): Headers {
    const h = new Headers({ 'Content-Type': 'application/json' });
    const browser = getBrowser();
    const tok = browser && browser.localStorage ? browser.localStorage.getItem('token') : null;
    if (tok) h.set('Authorization', 'Bearer ' + tok);
    return h;
  }

  // PUBLIC_INTERFACE
  async login(username: string, password: string): Promise<any> {
    const browser = getBrowser();
    if (!browser || !browser.fetch) throw new Error('Not in browser');
    const resp = await browser.fetch(`${this.backendUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password })
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  }

  // PUBLIC_INTERFACE
  async register(username: string, password: string): Promise<any> {
    const browser = getBrowser();
    if (!browser || !browser.fetch) throw new Error('Not in browser');
    const resp = await browser.fetch(`${this.backendUrl}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password })
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  }

  // PUBLIC_INTERFACE
  async getProfile(): Promise<any> {
    const browser = getBrowser();
    if (!browser || !browser.fetch) throw new Error('Not in browser');
    const resp = await browser.fetch(`${this.backendUrl}/user/profile`, { headers: this.getHeaders() });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  }

  // PUBLIC_INTERFACE
  async updateProfile(weight: number, height: number): Promise<any> {
    const browser = getBrowser();
    if (!browser || !browser.fetch) throw new Error('Not in browser');
    const resp = await browser.fetch(`${this.backendUrl}/user/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ weight, height })
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  }

  // PUBLIC_INTERFACE
  async getExercisePlan(): Promise<any> {
    const browser = getBrowser();
    if (!browser || !browser.fetch) throw new Error('Not in browser');
    const resp = await browser.fetch(`${this.backendUrl}/exercise/plan`, { headers: this.getHeaders() });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  }

  // PUBLIC_INTERFACE
  async uploadProof(blob: Blob): Promise<any> {
    const browser = getBrowser();
    if (!browser || !browser.fetch) throw new Error('Not in browser');
    const tok = browser.localStorage ? browser.localStorage.getItem('token') : null;
    const form = new FormData();
    form.append('video', blob, `workout_${+new Date()}.webm`);
    const resp = await browser.fetch(`${this.backendUrl}/workout/upload`, {
      method: 'POST',
      headers: tok ? { 'Authorization': 'Bearer ' + tok } as any : undefined,
      body: form
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  }

  // PUBLIC_INTERFACE
  async getWorkoutHistory(): Promise<any[]> {
    const browser = getBrowser();
    if (!browser || !browser.fetch) throw new Error('Not in browser');
    const resp = await browser.fetch(`${this.backendUrl}/workout/history`, { headers: this.getHeaders() });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  }
}
