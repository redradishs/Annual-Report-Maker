import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-uploadfiles',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './uploadfiles.component.html',
  styleUrl: './uploadfiles.component.css'
})
export class UploadfilesComponent implements AfterViewInit, OnInit {
  userId: number | null = null;






  @ViewChild('fileInput') fileInput!: ElementRef;
  progressArea!: HTMLElement;
  uploadedArea!: HTMLElement;
  selectedFiles: File[] = []; 

  constructor(private router: Router, private authService: AuthService, private api: ApiService) {} 

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
      } else {
        console.log('No user logged in.');
      }
    });
  }

  ngAfterViewInit() {
    this.progressArea = document.querySelector('.progress-area') as HTMLElement;
    this.uploadedArea = document.querySelector('.uploaded-area') as HTMLElement;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFiles = Array.from(target.files || []); 
  }

  submitFiles(event: Event) {
    event.preventDefault(); 
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        let fileName = file.name;
        if (fileName.length >= 12) {
          const splitName = fileName.split('.');
          fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        this.uploadFile(fileName, file);
      });
      this.router.navigate(['create/eventreport/uploadmedia/view']); 
    } else {
      alert('No files selected!');
    }
  }

  uploadFile(name: string, file: File) {
    if (this.userId === null) {
      console.error('User ID is not set.');
      return;
    }
    this.api.uploadFile(this.userId, file).subscribe({
      next: (response) => {
        console.log('File uploaded successfully', response);
        this.updateProgressUI(name, file.size, 100, true);
      },
      error: (error) => {
        console.error('File upload failed', error);
        this.updateProgressUI(name, file.size, 100, false);
      }
    });
  }

  updateProgressUI(name: string, size: number, progress: number, success: boolean) {
    const fileLoaded = progress;
    const fileTotal = Math.floor(size / 1000);
    const fileSize = fileTotal < 1024 ? `${fileTotal} KB` : `${(size / (1024 * 1024)).toFixed(2)} MB`;

    if (success) {
      const uploadedHTML = `
        <li class="row">
          <div class="content upload">
            <i class="fas fa-file-alt"></i>
            <div class="details">
              <span class="name">${name} • Uploaded</span>
              <span class="size">${fileSize}</span>
            </div>
          </div>
          <i class="fas fa-check"></i>
        </li>`;
      this.uploadedArea.classList.remove("onprogress");
      this.uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    } else {
      const progressHTML = `
        <li class="row">
          <i class="fas fa-file-alt"></i>
          <div class="content">
            <div class="details">
              <span class="name">${name} • Uploading</span>
              <span class="percent">${fileLoaded}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: ${fileLoaded}%"></div>
            </div>
          </div>
        </li>`;
      this.uploadedArea.classList.add("onprogress");
      this.progressArea.innerHTML = progressHTML;
    }
  }

  skipUpload() {
    alert('Upload skipped!');
    this.router.navigate(['/create/eventreport/uploadmedia/view']);
  }
}