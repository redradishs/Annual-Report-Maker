import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { BrowserService } from '../../services/browser.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';




@Component({
  selector: 'app-collage',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './collage.component.html',
  styleUrls: ['./collage.component.css']
})
export class CollageComponent {
  imageUrls: string[] = []; // Initialize an empty array to store image URLs
  selectedFiles: File[] = [];
  userId: number | null = null;
  selectedFormat: string | null = null;


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('collageCanvas') collageCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private browserService: BrowserService, 
    private authService: AuthService,
    private http: HttpClient, 
    private router: Router,
    private apiService: ApiService
  ) {}

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

  onFileSelected(files: FileList | null) {
    const maxImages = 8;
    if (files) {
      for (let i = 0; i < Math.min(maxImages - this.imageUrls.length, files.length); i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (event: Event) => {
          const fileReader = event.target as FileReader;
          this.imageUrls.push(fileReader.result as string);
        };
        this.selectedFiles.push(files[i]);
      }
    }
  }

  selectFormat(format: string) {
    this.selectedFormat = format;
  }


  removeImage(imageUrl: string) {
    this.imageUrls = this.imageUrls.filter(url => url !== imageUrl);
  }

  
  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.onFileSelected(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }


 createCollage() {
    if (this.browserService.document && this.selectedFormat) {
      const canvas: HTMLCanvasElement = this.collageCanvas.nativeElement;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const gridSize = this.selectedFormat === '3x3' ? 3 : 4;
        const cellSize = 100; // Set the cell size to a fixed value
        const collageSize = cellSize * gridSize;

        canvas.width = collageSize;
        canvas.height = collageSize;

        ctx.clearRect(0, 0, collageSize, collageSize);

        let imagePromises = this.imageUrls.map((imageUrl) => this.loadImage(imageUrl));

        Promise.all(imagePromises).then(images => {
          images.forEach((img, index) => {
            const x = (index % gridSize) * cellSize;
            const y = Math.floor(index / gridSize) * cellSize;
            ctx.drawImage(img, x, y, cellSize, cellSize);
          });

          // Convert the canvas to a data URL and submit it to the server
          const collageDataUrl = canvas.toDataURL();
          this.submitAndNavigate(collageDataUrl);
        });
      }
    }
  }

  submitAndNavigate(collageDataUrl: string) {
    if (this.userId !== null) {
      const collageData = {
        userId: this.userId,
        collage: collageDataUrl
      };


      this.apiService.submitCollage(this.userId, collageData)
        .subscribe(
          (response) => {
            console.log('Collage submitted:', response);
            this.router.navigate(['create/eventreport/uploadmedia/view']);
          },
          (error) => {
            console.error('Error submitting collage', error);
          }
        );
    } else {
      console.error('User ID is not set.');
    }
  }

  cancelCollage() {
    this.imageUrls = [];
    this.imageInput.nativeElement.value = '';
    this.selectedFormat = null;
    if (this.browserService.document) {
      const canvas: HTMLCanvasElement = this.collageCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  uploadFile(fileName: string, file: File) {
    console.log(`Uploading file: ${fileName}`);
  }
}
