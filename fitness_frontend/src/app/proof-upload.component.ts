import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './shared/api.service';
import { getBrowser } from './shared/ssr-utils';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-proof-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" style="max-width:420px;">
      <h3>Upload Workout Proof</h3>
      <div *ngIf="!recording && !recordedBlob">
        <button (click)="startRecording()" [disabled]="!!videoStream || loading">Record Video</button>
      </div>
      <div *ngIf="recording">
        <video #liveVideo autoplay playsinline muted width="320" height="240"></video>
        <button (click)="stopRecording()">Stop</button>
      </div>
      <div *ngIf="recordedBlob">
        <video [src]="videoUrl" width="320" height="240" controls></video>
        <div>
          <button (click)="upload()" [disabled]="loading">Upload</button>
          <button (click)="reset()" [disabled]="loading">Reset</button>
        </div>
      </div>
      <div *ngIf="status">{{status}}</div>
      <div *ngIf="error" class="form-error">{{error}}</div>
    </div>
  `,
  styles: [`.form-error { color: #f15a4a; margin-top:10px;}`]
})
export class ProofUploadComponent {
  loading = false;
  recording = false;
  recordedBlob: Blob|null = null;
  videoUrl: string|null = null;
  videoStream: MediaStream|null = null;
  status = '';
  error = '';

  constructor(private api: ApiService) {}

  async startRecording() {
    this.status = '';
    this.error = '';
    const browser = getBrowser();
    if (!browser || !browser.navigator) {
      this.error = 'Camera not available.';
      return;
    }
    try {
      this.videoStream = await browser.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.recording = true;
      if (browser.setTimeout) {
        browser.setTimeout(() => this.doRecord(), 200);
      }
    } catch {
      this.error = 'Camera not available / permission denied.';
    }
  }

  private recorder: MediaRecorder|null = null;
  private chunks: BlobPart[] = [];
  doRecord() {
    const browser = getBrowser();
    if (!browser || !browser.document) return;
    const video = browser.document.querySelector('video#liveVideo') as HTMLVideoElement;
    if (video && this.videoStream) {
      video.srcObject = this.videoStream;
      this.recorder = new MediaRecorder(this.videoStream);
      this.chunks = [];
      this.recorder.ondataavailable = (ev) => this.chunks.push(ev.data);
      this.recorder.onstop = () => {
        this.recordedBlob = new Blob(this.chunks, { type: 'video/webm' });
        const urlCreator = typeof URL !== 'undefined' ? URL : undefined;
        this.videoUrl = urlCreator ? urlCreator.createObjectURL(this.recordedBlob) : '';
        this.stopStream();
        this.recording = false;
      };
      this.recorder.start();
    }
  }
  stopRecording() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }
  stopStream() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(t => t.stop());
      this.videoStream = null;
    }
  }
  reset() {
    this.status = '';
    this.error = '';
    this.recordedBlob = null;
    this.videoUrl = null;
    this.stopStream();
  }
  async upload() {
    if (!this.recordedBlob) return;
    this.loading = true;
    this.error = '';
    this.status = '';
    try {
      // Use injected ApiService for uploading proof
      await this.api.uploadProof(this.recordedBlob);
      this.status = 'Upload successful!';
      this.recordedBlob = null;
      this.videoUrl = null;
    } catch {
      this.error = 'Upload failed, try again.';
    }
    this.loading = false;
  }
}
