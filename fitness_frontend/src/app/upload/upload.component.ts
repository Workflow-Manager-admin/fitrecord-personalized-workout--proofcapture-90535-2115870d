import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  errorMsg = '';
  uploadMsg = '';
  uploading = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  selectedFileType: string | null = null;

  constructor(private api: ApiService) {}

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    this.previewUrl = null;
    this.selectedFile = null;
    this.selectedFileType = null;
    if (file) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        this.errorMsg = 'Only image or video files are accepted';
        return;
      }
      this.errorMsg = '';
      this.selectedFile = file;
      this.selectedFileType = file.type;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = (e.target as FileReader).result as string;
      reader.readAsDataURL(file);
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.errorMsg = 'Select a file or capture a workout proof first.';
      return;
    }
    this.uploading = true;
    this.uploadMsg = '';
    this.api.uploadWorkoutProof(this.selectedFile).subscribe({
      next: () => {
        this.uploadMsg = 'Workout proof uploaded!';
        this.uploading = false;
        this.selectedFile = null;
        this.selectedFileType = null;
        this.previewUrl = null;
      },
      error: (e) => {
        this.errorMsg = e?.message || 'Upload failed.';
        this.uploading = false;
      }
    });
  }
}
