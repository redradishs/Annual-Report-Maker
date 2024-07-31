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
  imageUrls: string[] = [];
  selectedFiles: File[] = [];
  userId: number | null = null;
  selectedFormat: string | null = null;
  isCollageCreated = false; // Added variable
  showToast = false;

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('collageCanvas') collageCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private browserService: BrowserService, 
    private authService: AuthService,
    private http: HttpClient, 
    private router: Router
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

  selectFormat(format: string) {
    if (['2x2', '3x3', '4x4'].includes(format)) {
      this.selectedFormat = format;
    } else {
      console.error('Unsupported format selected');
    }
  }

  onFileSelected(files: FileList | null) {
    const maxImages = this.selectedFormat === '2x2' ? 4 :
                      this.selectedFormat === '3x3' ? 9 :
                      this.selectedFormat === '4x4' ? 16 : 0;

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
      // Determine gridSize and cellSize based on the selected format
      const gridSize = this.selectedFormat === '2x2' ? 2 : this.selectedFormat === '3x3' ? 3 : 4;
      const cellSize = this.selectedFormat === '2x2' ? 200 : 150; // Adjust cellSize based on format
      const gap = 5; // Gap between images
      const collageSize = (cellSize + gap) * gridSize - gap; // Adjust collage size to account for gaps

      canvas.width = collageSize;
      canvas.height = collageSize;

      ctx.clearRect(0, 0, collageSize, collageSize);

      let imagePromises = this.imageUrls.map((imageUrl) => this.loadImage(imageUrl));

      Promise.all(imagePromises).then(images => {
        images.forEach((img, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          const x = col * (cellSize + gap);
          const y = row * (cellSize + gap);
          ctx.drawImage(img, x, y, cellSize, cellSize);
        });

        // Convert the canvas to a data URL and submit it to the server
        const collageDataUrl = canvas.toDataURL();
        this.submitAndNavigate(collageDataUrl);
        this.isCollageCreated = true; // Set to true when collage is created

      });
    }
  }
}

  
  downloadCollage() {
    if (this.isCollageCreated) {
      const canvas: HTMLCanvasElement = this.collageCanvas.nativeElement;
      const collageDataUrl = canvas.toDataURL('image/png');
  
      // Create a temporary anchor element and click it to start the download
      const link = document.createElement('a');
      link.href = collageDataUrl;
      link.download = 'collage.png';
      link.click();
  
      // Optional: Log the URL to the console or handle it as needed
      console.log('Collage URL:', collageDataUrl);
    } else {
      console.error('Collage has not been created yet.');
    }
  }

  // shareCollage() {
  //   if (this.isCollageCreated) {
  //     const canvas: HTMLCanvasElement = this.collageCanvas.nativeElement;
  //     const collageDataUrl = canvas.toDataURL('image/png');
  
  //     if (navigator.share) {
  //       // Web Share API does not support Data URLs, so this will be a fallback method
  //       navigator.share({
  //         title: 'My Collage',
  //         text: 'Check out this collage I made!',
  //         // URL can be shared if it's uploaded to a server
  //         url: 'https://your-server-path/' + encodeURIComponent(collageDataUrl)
  //       }).then(() => {
  //         console.log('Collage shared successfully');
  //       }).catch((error) => {
  //         console.error('Error sharing collage:', error);
  //       });
  //     } else {
  //       console.log('Web Share API is not supported in this browser.');
  //       // Provide a fallback: Copy to clipboard
  //       this.copyToClipboard(collageDataUrl);
  //       alert('Collage URL copied to clipboard');
  //     }
  //   } else {
  //     console.error('Collage has not been created yet.');
  //   }
  // }
  
  // copyToClipboard(text: string) {
  //   const textArea = document.createElement('textarea');
  //   textArea.value = text;
  //   document.body.appendChild(textArea);
  //   textArea.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(textArea);
  //   console.log('Collage URL copied to clipboard:', text);
  // }
  

  
  submitAndNavigate(collageDataUrl: string) {
    if (this.userId !== null) {
      const collageData = {
        userId: this.userId,
        collage: collageDataUrl
      };

      const endpoint = `https://gcccsarco.online/arcoapi/api/collage/${this.userId}`;

      this.http.post(endpoint, collageData)
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


  cancelCollage(event?: MouseEvent) {
    if (event) {
      event.preventDefault(); // Prevent default button action
    }
    
    // Clear image URLs
    this.imageUrls = [];
  
    // Reset file input
    if (this.imageInput) {
      this.imageInput.nativeElement.value = '';
    }
  
    // Reset collage state
    // this.selectedFormat = null;
    // this.isCollageCreated = false;
  
    // Clear canvas if it exists
    if (this.collageCanvas && this.collageCanvas.nativeElement) {
      const canvas: HTMLCanvasElement = this.collageCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
  

  exitCollage() {
    this.imageUrls = [];
    this.imageInput.nativeElement.value = '';
    this.selectedFormat = null;
    this.isCollageCreated = false; // Reset when cancelled
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
