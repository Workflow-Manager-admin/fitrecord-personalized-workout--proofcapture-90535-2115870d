declare const window: any;
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnDestroy {
  errorMsg = '';
  uploadMsg = '';
  uploading = false;
  // The following fields related to the removed file option are deleted:
  // - previewUrl, selectedFileType

  selectedFile: File | null = null;
  videoPreviewUrl: string | null = null;

  // Webcam/video recording state
  isRecording = false;
  videoStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  isCameraEnabled = false;

  // PUBLIC_INTERFACE
  ngOnDestroy() {
    this.stopCamera();
    this.revokePreviewUrl();
  }

  // Only enable video camera and clear any leftover state
  async enableCamera() {
    try {
      if (this.videoStream) this.stopCamera();
      this.videoStream = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.isCameraEnabled = true;
      this.errorMsg = '';
      this.selectedFile = null;
      this.uploadMsg = '';
      this.revokePreviewUrl();
      this.videoPreviewUrl = null;
    } catch {
      this.errorMsg = 'Unable to access camera. Please grant permission.';
    }
  }

  // Stop webcam and associated resources
  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
      this.isCameraEnabled = false;
    }
    this.stopRecording();
  }

  // Start recording webcam video
  startRecording() {
    if (!this.videoStream) {
      this.errorMsg = 'Enable the camera first.';
      return;
    }
    this.errorMsg = '';
    this.uploadMsg = '';
    try {
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.videoStream as MediaStream, { mimeType: 'video/webm' });
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.selectedFile = new File([blob], 'workout-proof.webm', { type: 'video/webm' });
        this.revokePreviewUrl();
        this.videoPreviewUrl = URL.createObjectURL(blob);
      };
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch {
      this.errorMsg = 'Failed to start recording.';
    }
  }

  // Stop video recording
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  revokePreviewUrl() {
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
  }

  // Only allow upload after video is present (no file picker possible)
  async onUpload() {
    this.uploadMsg = '';
    this.errorMsg = '';
    if (!this.selectedFile) {
      this.errorMsg = 'No video recorded. Please record a video from your camera.';
      return;
    }
    this.uploading = true;
    try {
      // API service is not injected in this starter; show demo message for now
      await new Promise(resolve => window.setTimeout(resolve, 1000));
      this.uploadMsg = 'Upload successful! Workout proof received 👏';
      this.selectedFile = null;
      this.revokePreviewUrl();
    } catch {
      this.errorMsg = 'Upload failed.';
    } finally {
      this.uploading = false;
    }
  }
}
