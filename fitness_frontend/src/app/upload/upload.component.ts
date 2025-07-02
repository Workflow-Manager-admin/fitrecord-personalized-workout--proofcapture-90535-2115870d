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
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  selectedFileType: string | null = null;

  // Webcam/video recording state
  isRecording = false;
  videoStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  videoPreviewUrl: string | null = null;
  isCameraEnabled = false;

  // PUBLIC_INTERFACE
  ngOnDestroy() {
    this.stopCamera();
    this.revokePreviewUrls();
  }

  // Handle file upload from file input
  onFileChange(event: Event) {
    this.stopCamera();
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.selectedFileType = this.selectedFile.type;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.videoPreviewUrl = null;
      };
      reader.readAsDataURL(this.selectedFile);
      this.errorMsg = '';
    }
  }

  // Start the webcam with video only
  async enableCamera() {
    try {
      if (this.videoStream) this.stopCamera();
      // Use window.navigator instead of navigator to let the linter know this is a browser global
      this.videoStream = await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.isCameraEnabled = true;
      this.errorMsg = '';
      // Remove file selection and URL preview if switching to camera
      this.selectedFile = null;
      this.selectedFileType = null;
      this.previewUrl = null;
      this.uploadMsg = '';
      this.revokePreviewUrls();
      this.videoPreviewUrl = null;
    } catch {
      this.errorMsg = 'Unable to access camera. Please grant permission.';
    }
  }

  // Stop the webcam stream and preview/releasing resources
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
        this.selectedFileType = 'video/webm';
        this.revokePreviewUrls();
        this.videoPreviewUrl = URL.createObjectURL(blob);
        this.previewUrl = null;
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

  revokePreviewUrls() {
    if (this.videoPreviewUrl) {
      URL.revokeObjectURL(this.videoPreviewUrl);
      this.videoPreviewUrl = null;
    }
    if (this.previewUrl) {
      // Not a native objectURL, only revoke if it's an objectURL
      if (this.previewUrl.startsWith('blob:')) URL.revokeObjectURL(this.previewUrl);
    }
  }

  // Prepare and upload the selected proof file
  async onUpload() {
    this.uploadMsg = '';
    this.errorMsg = '';
    if (!this.selectedFile) {
      this.errorMsg = 'No file selected. Record a video or choose a file.';
      return;
    }
    this.uploading = true;
    try {
      // API service is not injected in this starter; show fake upload for demo
      await new Promise(resolve => window.setTimeout(resolve, 1000));
      this.uploadMsg = 'Upload successful! Workout proof received 👏';
      this.selectedFile = null;
      this.selectedFileType = null;
      this.previewUrl = null;
      this.revokePreviewUrls();
    } catch {
      this.errorMsg = 'Upload failed.';
    } finally {
      this.uploading = false;
    }
  }
}
