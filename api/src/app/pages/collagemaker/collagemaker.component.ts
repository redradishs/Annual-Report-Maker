import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-collagemaker',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './collagemaker.component.html',
  styleUrl: './collagemaker.component.css'
})
export class CollagemakerComponent {
  @ViewChild('view', { static: false }) view!: ElementRef;
  aspectRatio: string = '1/1'; // Default aspect ratio
  images: File[] = [];
  imageWidth: number = 200; // Default image width
  imageHeight: number = 200; // Default image height
  layouts = [
    { name: 'Layout 1', image: '/assets/layout1.png', config: '1x1' },
    { name: 'Layout 2', image: '/assets/layout2.png', config: '2x2' },
    // Add more layouts here
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.images = Array.from(input.files);
      this.createCollage();
    }
  }

  createCollage(): void {
    const viewElement = this.view.nativeElement;
    viewElement.innerHTML = ''; // Clear previous collage

    const columns = Math.ceil(Math.sqrt(this.images.length));
    const rows = Math.ceil(this.images.length / columns);

    viewElement.style.display = 'grid';
    viewElement.style.gridTemplateColumns = `repeat(${columns}, ${this.imageWidth}px)`;
    viewElement.style.gridTemplateRows = `repeat(${rows}, ${this.imageHeight}px)`;
    viewElement.style.gap = '10px';

    this.images.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target!.result as string;
        img.style.width = `${this.imageWidth}px`;
        img.style.height = `${this.imageHeight}px`;
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px'; // Example for corner radius
        img.style.aspectRatio = this.aspectRatio; // Set aspect ratio
        viewElement.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  setAspectRatio(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.aspectRatio = select.value.replace(':', '/'); // Set the aspect ratio of the collage
    // Optionally, update image dimensions based on aspect ratio
    const [width, height] = select.value.split(':').map(Number);
    this.imageWidth = width * 100; // Adjust multiplier as needed
    this.imageHeight = height * 100; // Adjust multiplier as needed
    this.updateCollage();
  }

  setColor(event: Event): void {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    this.view.nativeElement.style.backgroundColor = color;
  }

  setSpace(event: Event): void {
    const input = event.target as HTMLInputElement;
    const space = parseInt(input.value, 10) || 20;
    this.view.nativeElement.style.gap = `${space}px`;
  }

  setCorner(event: Event): void {
    const input = event.target as HTMLInputElement;
    const radius = parseInt(input.value, 10) || 0;
    const images = this.view.nativeElement.querySelectorAll('img');
    images.forEach((img: HTMLElement) => {
      img.style.borderRadius = `${radius}px`;
    });
  }

  clearCollage(): void {
    this.images = [];
    const viewElement = this.view.nativeElement;
    while (viewElement.firstChild) {
      viewElement.removeChild(viewElement.firstChild);
    }
  }

  saveCollage(): void {
    const viewElement = this.view.nativeElement;
  
    // Get the current dimensions of the view element
    const width = viewElement.offsetWidth;
    const height = viewElement.offsetHeight;
  
    // Create a temporary container to hold the view element
    const tempContainer = document.createElement('div');
    tempContainer.style.width = `${width}px`;
    tempContainer.style.height = `${height}px`;
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);
  
    // Clone the view element and append it to the temporary container
    const clonedViewElement = viewElement.cloneNode(true) as HTMLElement;
    clonedViewElement.style.width = `${width}px`;
    clonedViewElement.style.height = `${height}px`;
    clonedViewElement.style.position = 'relative'; // Ensure relative positioning
    clonedViewElement.style.overflow = 'hidden'; // Prevent overflow issues
    tempContainer.appendChild(clonedViewElement);
  
    // Capture the cloned view element with html2canvas
    html2canvas(clonedViewElement, {
      scale: window.devicePixelRatio, // Use the device's pixel ratio for high resolution
      useCORS: true, // Use CORS to handle images from different origins
      backgroundColor: null // Transparent background if needed
    }).then(canvas => {
      // Create a link to download the canvas as a PNG image
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'collage.png';
      link.click();
  
      // Clean up temporary elements
      document.body.removeChild(tempContainer);
    }).catch(error => {
      console.error('Error capturing collage:', error);
    });
  }
  


  selectLayout(layout: any): void {
    const viewElement = this.view.nativeElement;
    viewElement.className = 'view ' + layout.config; // Apply layout configuration
  
    // Optionally, you can add more logic here if needed
    this.updateCollage();
  }
  

  updateCollage(): void {
    if (this.images.length > 0) {
      this.createCollage();
    }
  }
}
