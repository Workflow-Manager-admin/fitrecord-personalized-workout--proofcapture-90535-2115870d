import { Component } from '@angular/core';
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

  // No constructor required since no DI services are actually referenced.

  onFileChange() {
    // Implementation must be updated if ApiService needed.
  }

  onUpload() {
    // Implementation must be updated if ApiService needed.
  }
}
