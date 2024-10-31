import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterConfigOptions, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';
import { PDFDocument, rgb } from 'pdf-lib';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BackComponent } from '../../addons/back/back.component';




@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterLink, BackComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent {
  folderType: string = '';
  folderId: number | null = null;
  documents: any[] = [];

  collaborationData: any[] = [];
  userId: number | null = null;
  availableTemplates: any[] = [];

  private uploadUrl: string = '';
  private fetchUrl: string = '';

  images: string[] = [];
  elements: any[] = []; // Add this line to define the elements property


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
  
        this.route.paramMap.subscribe(params => {
          this.folderType = params.get('folderType') || '';
          this.folderId = Number(params.get('folderId'));
  
          if (this.folderType === 'Collaboration') {
            this.retrieveCollaborations();
          } else if (this.folderType === 'Templates') {
            this.retrieveAllTemplates();
          } else if (this.folderType === 'Elements') {
            this.uploadUrl = this.apiService.getUploadUrl(this.userId!);
            this.fetchUrl = this.apiService.getFetchUrl(this.userId!);
            this.fetchImages(); // Add this line to fetch images
          } 
          else {
            this.fetchReports(this.folderId);
          }
        });
      } else {
        console.log('No user logged in.');
      }
    });
  }
  
    private cleanUsername(username: string): string {
    return username.trim().replace(/^"|"$/g, '');
  }


 // Add the fetchImages method
 fetchImages(): void {
  this.apiService.fetchImages(this.fetchUrl).subscribe(
    (response) => {
      console.log('Fetch Images Response:', response); 
      if (response.data && Array.isArray(response.data)) {
        this.images = response.data.map((item: any) => this.apiService.constructImageUrl(item.file_path));
        this.elements = response.data.map((item: any) => ({
          id: item.img_id,
          user_id: item.user_id,
          file_path: item.file_path,
          created_at: item.uploaded_at
        }));
        
      } else {
        console.error('Expected an array of images, but got:', response);
      }
    },
    (error) => {
      console.error('Error fetching images:', error);
    }
  );
}


// Add the method to delete an element
deleteElement(elementId: number): void {
  if (confirm('Are you sure you want to delete this element?')) {
    this.apiService.deleteassets(elementId).subscribe(() => {
      console.log('Element deleted');
      this.fetchImages(); // Re-fetch images after deletion
    }, error => {
      console.error('Error deleting element:', error);
    });
  }
}

  fetchReports(folderId: number): void {
    this.apiService.getReportsByFolderId(folderId).subscribe(reports => {
      this.documents = reports;
      console.log('Documents:', this.documents);
      this.fetchUsernamesForReports();
    });
  }

  fetchUsernamesForReports(): void {
    const requests = this.documents.map(doc => this.apiService.getUsername(doc.user_id));
    forkJoin(requests).subscribe(usernames => {
      console.log('Usernames fetched for reports:', usernames); 
      this.documents.forEach((doc, index) => {
        doc.username = this.cleanUsername(usernames[index]);
      });
      console.log('Updated documents:', this.documents); 
    }, error => {
      console.error('Error fetching usernames for reports:', error);
    });
  }
  

  retrieveCollaborations() {
    this.apiService.getCollaborations(this.userId!).subscribe(
      (resp: any) => {
        this.collaborationData = resp;
        console.log('Collaboration', this.collaborationData);
        this.fetchUsernamesForCollaborations();
      },
      (error) => {
        console.log('error');
      }
    );
  }

  fetchUsernamesForCollaborations(): void {
    const requests = this.collaborationData.map(collab => this.apiService.getUsername(collab.user_id));
    forkJoin(requests).subscribe(usernames => {
      console.log('Usernames fetched for collaborations:', usernames); 
      this.collaborationData.forEach((collab, index) => {
        collab.username = this.cleanUsername(usernames[index]);
      });
      console.log('Updated collaborations:', this.collaborationData); 
    }, error => {
      console.error('Error fetching usernames for collaborations:', error);
    });
  }
  


  retrieveAllTemplates() {
    this.apiService.getTemplates().subscribe(
      (resp: any) => {
        this.availableTemplates = resp;
        this.fetchUsernamesForTemplates();
      }
    );
  }

  fetchUsernamesForTemplates(): void {
    const requests = this.availableTemplates.map(template => this.apiService.getUsername(template.user_id));
    forkJoin(requests).subscribe(usernames => {
      console.log('Usernames fetched for templates:', usernames); 
      this.availableTemplates.forEach((template, index) => {
        template.username = this.cleanUsername(usernames[index]);
      });
      console.log('Updated templates:', this.availableTemplates); 
    }, error => {
      console.error('Error fetching usernames for templates:', error);
    });
  }
  

  deleteFolder(folderId: number | null | undefined): void {
    if (folderId == null) {
      console.error('Folder ID is null or undefined');
      return;
    }

    if (confirm('Are you sure you want to delete this folder?')) {
      this.apiService.deleteFolder(folderId).subscribe(() => {
        console.log('Folder deleted');
        this.router.navigate(['/report']); 
      });
    }
  }

  removeFile(id: number) {
    if (confirm('Are you sure you want to remove this from the folder?')) {
      this.apiService.removefromFolder(id).subscribe(
        (resp: any) => {
          if (resp.success) {
            console.log('File removed from folder successfully.');
            this.fetchReports(this.folderId!);
          } else {
            console.error('Failed to remove file from folder:', resp.message);
          }
        },
        (error: any) => {
          console.error('Error removing file from folder:', error);
        }
      );
    }
  }

createTemplate(): void {
  this.router.navigate(['/template']);
}




// async downloadAllDocuments() {
//   if (typeof document === 'undefined') {
//     console.error('Document is not available.');
//     return;
//   }

//   const zip = new JSZip();

//   for (const doc of this.documents) {
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pageWidth = 210; // A4 width in mm
//     const pageHeight = 297; // A4 height in mm
//     const margin = 10; // Define a margin in mm
//     const contentWidth = pageWidth - 2 * margin;
//     const contentHeight = pageHeight - 2 * margin; // Adjust content height for top and bottom margins

//     // Create a temporary div to hold the document content
//     const tempDiv = document.createElement('div');
//     tempDiv.style.width = `${contentWidth}mm`;
//     tempDiv.style.position = 'absolute';
//     tempDiv.style.top = '-9999px'; // Position it off-screen
//     tempDiv.innerHTML = `<div>${doc.content}</div>`;
//     document.body.appendChild(tempDiv);

//     // Use html2canvas to capture the content as an image
//     const canvas = await html2canvas(tempDiv, { scale: 2 });
//     const imgData = canvas.toDataURL('image/png');

//     // Calculate the total height of the image in mm
//     const imgHeight = (canvas.height * contentWidth) / canvas.width;
//     const pageCanvasHeight = (canvas.height * contentHeight) / imgHeight;

//     let yOffset = 0;
//     let pageNumber = 0;

//     while (yOffset < canvas.height) {
//       if (pageNumber > 0) {
//         pdf.addPage();
//       }

//       const pageCanvas = document.createElement('canvas');
//       pageCanvas.width = canvas.width;
//       pageCanvas.height = Math.min(pageCanvasHeight, canvas.height - yOffset);

//       const ctx = pageCanvas.getContext('2d');
//       if (!ctx) {
//         console.error('Failed to get canvas context');
//         break;
//       }

//       ctx.drawImage(canvas, 0, -yOffset, canvas.width, canvas.height);

//       const pageImgData = pageCanvas.toDataURL('image/png');
//       pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, Math.min(contentHeight, imgHeight - yOffset * (imgHeight / canvas.height)));

//       yOffset += pageCanvasHeight;
//       pageNumber++;
//     }

//     // Remove the temporary div
//     document.body.removeChild(tempDiv);

//     // Generate the PDF as a blob and add it to the zip
//     const pdfBlob = pdf.output('blob');
//     zip.file(`${doc.title}.pdf`, pdfBlob);
//   }

//   // Generate the zip file and trigger the download
//   const zipBlob = await zip.generateAsync({ type: 'blob' });
//   saveAs(zipBlob, 'all_documents.zip');
// }


async downloadAllDocuments(folderName: string) {
  if (typeof document === 'undefined') {
    console.error('Document is not available.');
    return;
  }

  const zip = new JSZip();

  for (const doc of this.documents) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; 
    const pageHeight = 297; 
    const margin = 10; 
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin; 


    const tempDiv = document.createElement('div');
    tempDiv.style.width = `${contentWidth}mm`;
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '-9999px'; 
    tempDiv.innerHTML = `<div>${doc.content}</div>`;
    document.body.appendChild(tempDiv);

    
    const canvas = await html2canvas(tempDiv, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');

   
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    const pageCanvasHeight = (canvas.height * contentHeight) / imgHeight;

    let yOffset = 0;
    let pageNumber = 0;

    while (yOffset < canvas.height) {
      if (pageNumber > 0) {
        pdf.addPage();
      }

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageCanvasHeight, canvas.height - yOffset);

      const ctx = pageCanvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        break;
      }

      ctx.drawImage(canvas, 0, -yOffset, canvas.width, canvas.height);

      const pageImgData = pageCanvas.toDataURL('image/png');
      pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, Math.min(contentHeight, imgHeight - yOffset * (imgHeight / canvas.height)));

      yOffset += pageCanvasHeight;
      pageNumber++;
    }


    document.body.removeChild(tempDiv);

  
    const pdfBlob = pdf.output('blob');
    zip.file(`${doc.title}.pdf`, pdfBlob);
  }


  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${folderName}.zip`);
}

  


}