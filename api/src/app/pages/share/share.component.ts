import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';  
import { ApiService } from '../../services/api.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { BackComponent } from '../../addons/back/back.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../richtext/pagination/pagination.component';
import { PDFDocument, rgb } from 'pdf-lib';
import { ChatbotLoaderService } from '../../services/chatbot-loader.service';
import { HhtmlsplitterService } from '../../services/hhtmlsplitter.service';
import { TimeAgoPipe } from '../../time-ago.pipe';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, PaginationComponent, BackComponent, TimeAgoPipe],
  templateUrl: './share.component.html',
  styleUrl: './share.component.css',
  providers: [DatePipe]
})
export class ShareComponent {
  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('printSection') printSection!: ElementRef;

  profileData: any = {};
  username: string | null = null;
  wordCount: number = 0;
  content: string = '';
  userId: number | null = null;
  postId: number | null = null; 
  ownerId: number | null = null;
  ownerUsername: string | null = null;
  created_at: string | null = null;
  can_edit: number | null = null;

  documentTitle: string = 'Untitled Document';
  documentDestroyed: boolean = false;

  totalPages: number = 1;
  currentPage: number = 1;
  charactersPerPage: number = 99999999; 
  paginatedContent: SafeHtml[] = [];

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService,
    private chatbotloader: ChatbotLoaderService,
    private sanitizer: DomSanitizer,
    private htmlSplitter: HhtmlsplitterService,
    private router: Router,
    private api: ApiService
  ) {}
  ngOnInit() {
    this.chatbotloader.loadScript(); 
  
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.retrieveProfileData();
      } else {
        console.log('No user logged in.');
      }
    });
  
    this.route.paramMap.subscribe(params => {
      const token = params.get('link_token');
      if (token) {
        console.log('Link token:', token);
        this.fetchSharedContent(token);
      } else {
        console.error('No link token provided in the URL.');
      }
    });

  }
  
  

  retrieveProfileData() {
    if (this.userId !== null) {
      this.api.getProfileData(this.userId).subscribe(
        (resp: any) => {
          if (resp.data && resp.data.length > 0) {
            this.profileData = resp.data[0];
            this.username = this.profileData.username;
            console.log('Username:', this.username);
          } else {
            console.error('No data available');
          }
        },
        (error) => {
          console.error('Error retrieving profile data', error);
        }
      );
    } else {
      console.error('User ID is not set.');
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveTitle();
    }
  }

  paginateContent() {
    this.paginatedContent = this.htmlSplitter.splitHtmlContent(this.content, this.charactersPerPage);
    this.totalPages = this.paginatedContent.length;
    console.log('Total Pages:', this.totalPages); 
  }

  saveTitle(): void {
    if (this.postId !== null) {
      this.api.saveTitle(this.postId, this.documentTitle).subscribe(
        response => {
          console.log('Title saved:', response);
          this.titleInput.nativeElement.blur();
        },
        error => {
          console.error('Error saving title:', error);
        }
      );
    } else {
      console.error('Post ID is not set.');
    }
  }

  fetchSharedContent(token: string) {
    this.api.sharedContent(token).subscribe(
      (resp: any) => {
        if (resp && resp.remarks === 'Failed' && resp.error === 'The document has been destroyed') {
          this.documentDestroyed = true;
          this.content = '';
          console.log('Document has been destroyed.');
        } else if (resp && resp.data) {
          this.ownerId = resp.data.user_id;
          this.OwnerInfo(this.ownerId!);  
          this.postId = resp.data.id;
          this.content = resp.data.content;
          this.documentTitle = resp.data.title;
          this.can_edit = resp.data.can_edit;
          this.created_at = resp.data.created_at;
          this.paginateContent();
          this.calculateTotalPages();
          setTimeout(() => {
            this.updateWordCount();
            console.log('Word Count:', this.wordCount);
          }, 0);
        } else {
          console.log('Unexpected response:', resp);
        }
      },
      (error) => {
        console.log('Error fetching shared content:', error);
      }
    );
  }
  
  


  OwnerInfo(ownerId: number) {
    this.api.getUsername(ownerId).subscribe(
      (data: any) => {
        this.ownerUsername = data.replace(/['"]+/g, '');
        console.log('Owner Username:', this.ownerUsername);
      },
      (error) => {
        console.error('Error fetching owner username:', error);
      }
    );
  }
  
  

  calculateTotalPages(): void {
    if (!this.content) {
      this.totalPages = 0;
      return;
    }
    const contentLength = this.content.length;
    this.totalPages = Math.ceil(contentLength / this.charactersPerPage);
  }
  

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateWordCount();
  }

  getPageContent(pageIndex: number): SafeHtml {
    if (!this.content) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    const start = pageIndex * this.charactersPerPage;
    const end = start + this.charactersPerPage;
    const pageContent = this.content.substring(start, end);
    return this.sanitizer.bypassSecurityTrustHtml(pageContent);
  }
  

  updateWordCount() {
    const contentContainer = document.getElementById('content-container') as HTMLElement;
    if (contentContainer) {
      const pageContents = contentContainer.querySelectorAll('.page-content');
      let totalContent = '';
  
      pageContents.forEach((pageContentElement: Element) => {
        totalContent += ' ' + (pageContentElement.textContent || '');
      });
  
      const strippedContent = totalContent.replace(/<\/?[^>]+(>|$)/g, ""); 
  
      const words = strippedContent.split(/\s+/).filter(word => word.length > 0).length;
      this.wordCount = words;
    } else {
      console.error('Content container element not found');
    }
  }

  async generatePDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(this.content, {
      x: 50,
      y: 350,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printPage() {
    window.print();
  }

  editContent() {
    if (this.authService.isAuthenticated()) {
        this.router.navigate(['/edit-document', this.postId]);
    } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: `/edit-document/${this.postId}` } });
    }
}
  

  printPaged() {
    const printContents = this.printSection.nativeElement.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
  
    if (printWindow) {
      printWindow.document.write('<html><head><title>' + this.documentTitle + '</title>');
      printWindow.document.write('<style>@media print { body { margin: 0; } }</style>'); 
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window');
    }
  }
}
