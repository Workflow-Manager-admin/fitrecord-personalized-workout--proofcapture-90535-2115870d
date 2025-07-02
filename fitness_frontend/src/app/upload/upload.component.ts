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

  onFileChange(event: Event) {
    // Implementation must be updated if ApiService needed.
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.selectedFileType = this.selectedFile.type;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.errorMsg = '';
    }
  }

  onUpload() {
    // Implementation must be updated if ApiService needed.
  }
}
