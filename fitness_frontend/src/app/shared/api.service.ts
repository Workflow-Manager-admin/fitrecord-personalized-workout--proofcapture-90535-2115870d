import { Injectable } from '@angular/core';

// PUBLIC_INTERFACE
import { getBrowser } from './ssr-utils';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private backendUrl = 'http://localhost:3001/api'; // TODO: adjust in production

  private getHeaders(): Headers {
    // No auth required anymore, just content-type
    return new Headers({ 'Content-Type': 'application/json' });
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
    const form = new FormData();
    form.append('video', blob, `workout_${+new Date()}.webm`);
    const resp = await browser.fetch(`${this.backendUrl}/workout/upload`, {
      method: 'POST',
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
