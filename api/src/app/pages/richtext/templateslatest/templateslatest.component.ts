import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { BackComponent } from '../../../addons/back/back.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ChatbotLoaderService } from '../../../services/chatbot-loader.service';
import { HhtmlsplitterService } from '../../../services/hhtmlsplitter.service';
import { ApiService } from '../../../services/api.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { PDFDocument, rgb } from 'pdf-lib';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface SelectedUser {
  user_id: number;
  created_by: string;
}

@Component({
  selector: 'app-templateslatest',
  standalone: true,
  imports: [NavbarComponent, FormsModule, PaginationComponent, BackComponent, CommonModule],
  templateUrl: './templateslatest.component.html',
  styleUrl: './templateslatest.component.css'
})
export class TemplateslatestComponent {
  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('printSection') printSection!: ElementRef;

  profileData: any = {};
  username: string | null = null;


  wordCount: number = 0;
  isModalOpen: boolean = false;
  shareLink: string = '';
  canEdit: boolean = false;
  viewLimit: number = 1;
  destroyAfterView: boolean = false;
  content: string = '';
  userId: number | null = null;
  postId: number | null = null; 

  selectedUsers: number[] = [];  
  users: { id: number, username: string }[] = [];
  sharedUsers: { id: number, username: string, collabId: number }[] = [];

  documentTitle: string = 'Untitled Document';



  totalPages: number = 1;
  currentPage: number = 1;
  charactersPerPage: number = 99999999; 
  paginatedContent: SafeHtml[] = [];

  constructor(
    private http: HttpClient,
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
        this.fetchContent().subscribe(() => {
          this.fetchSharedUsers();
        });
        this.fetchUsers();
        this.retrieveProfileData();
      } else {
        console.log('No user logged in.');
      }
    });
  }

  retrieveProfileData() {
    if (this.userId !== null) {
      this.api.getProfileData(this.userId).subscribe(
        (resp: any) => {
          console.log('Profile data:', resp);
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

  
  //changes
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveTitle();
    }
  }
  saveTitle(): void {
    if (this.postId !== null) {
      const url = this.api.FetchSaveTitleUrl(this.postId);
      const body = { title: this.documentTitle };
  
      this.api.saveTitled(url, body).subscribe(response => {
        console.log('Title saved:', response);
        this.titleInput.nativeElement.blur(); 
      }, error => {
        console.error('Error saving title:', error);
      });
    } else {
      console.error('Post ID is not set.');
    }
  }

  getUsernameById(userId: number): string {
    const user = this.users.find(user => user.id === userId);
    return user ? user.username : '';
  }


  
  

  fetchContent(): Observable<any> {
    if (this.userId !== null) {
      return this.api.templateisa(this.userId).pipe(
        tap((resp: any) => {
          console.log(resp);
          this.content = resp.data.content;
          this.postId = resp.data.id;
          this.documentTitle = resp.data.title;
          console.log('Post ID:', this.postId);
          this.paginateContent();
          this.calculateTotalPages();
          console.log('Total Pages:', this.totalPages);
          setTimeout(() => {
            this.updateWordCount();
            console.log('Word Count:', this.wordCount);
          }, 0);
        }),
        catchError((error) => {
          console.error('Error fetching event report:', error);
          return throwError(error);
        })
      );
    } else {
      console.error('User ID is not set.');
      return of(null);
    }
  }
  
  


  onUserSelect(selectedUserIds: number[]) {
    console.log('Selected User IDs:', selectedUserIds); 
  
   
    this.selectedUsers = [];
    console.log('Cleared selected users:', this.selectedUsers); 
  
    
    selectedUserIds.forEach(userId => {
      console.log('Adding user ID:', userId); 
      this.addUser(userId);
    });
  }
  
  addUser(userId: number) {
    if (!this.selectedUsers.includes(userId)) {
      this.selectedUsers.push(userId);
      console.log('Updated selected users:', this.selectedUsers); 
      this.addSelectedUsers([userId]); 
    }
  }
  fetchSharedUsers() {
    if (this.postId !== null) {
      this.api.fetchSharedUsers(this.postId).subscribe(
        (resp: { user_id: number, username: string, collab_id: number }[]) => {
          console.log('Shared TO:', resp);
          this.sharedUsers = resp.map(user => ({
            id: user.user_id,
            username: user.username,
            collabId: user.collab_id
          }));
          console.log('Mapped Shared TO:', this.sharedUsers);
        },
        (error) => {
          console.error('Error fetching shared users:', error);
        }
      );
    } else {
      console.error('Post ID is not set.');
    }
  }
  



  deleteUserCollab(collabId: number): void {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      this.api.deleteUserCollab(collabId).subscribe(
        () => {
          console.log('User collaboration deleted successfully');
          this.fetchSharedUsers();
        },
        error => {
          console.error('Error deleting report:', error);
        }
      );
    }
  }


  
  addSelectedUsers(selectedUsers: number[]) {
    if (this.postId !== null) {
      if (this.username === null) {
        console.error('Username is not set.');
        return;
      }

      const data: SelectedUser[] = selectedUsers.map(userId => ({
        user_id: userId,
        created_by: this.username as string
      }));

      console.log('Data being sent to the server:', JSON.stringify(data));

      this.api.addSelectedUsers(this.postId, data).subscribe(
        response => {
          console.log('Add Selected Users API Response:', response);
          if (response.error) {
            console.error('Error adding selected users:', response.error);
            alert(response.error);
          } else {
            console.log('Selected users added successfully');
            this.fetchSharedUsers();
          }
        },
        error => {
          console.error('Error adding selected users:', error);
        }
      );
    } else {
      console.error('Post ID is not set.');
    }
  }
  
  

  removeUser(userId: number) {
    this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
  }


  

  calculateTotalPages(): void {
    const contentLength = this.content.length;
    this.totalPages = Math.ceil(contentLength / this.charactersPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateWordCount();
    // console.log('Current Page:', this.currentPage); 
  }



  
  getPageContent(pageIndex: number): SafeHtml {
    const start = pageIndex * this.charactersPerPage;
    const end = start + this.charactersPerPage;
    const pageContent = this.content.substring(start, end);
    // console.log(`Page ${pageIndex + 1} Content:`, pageContent); 
    return this.sanitizer.bypassSecurityTrustHtml(pageContent);
  }
  
  fetchUsers() {
    if (this.userId !== null) {
      console.log(`Fetching users for user ID: ${this.userId}`);
      this.api.fetchUsers(this.userId).subscribe(
        (resp: { user_id: number, username: string }[] | null | undefined) => {
          if (resp) {
            console.log('Fetched users:', resp);
            this.users = resp.map(user => ({ id: user.user_id, username: user.username }));
            this.users.sort((a, b) => a.username.localeCompare(b.username));
            console.log('Mapped users:', this.users);
          } else {
            console.error('API response is null or undefined');
          }
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    } else {
      console.error('User ID is not set.');
    }
  }

  updateContent() {
    const contentElement = document.getElementById('content') as HTMLElement;
    const content = contentElement.innerHTML;
    if (this.postId !== null) {
      this.api.updateDocument(this.postId, content).subscribe(
        data => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
          }
        }
      );
    } else {
      console.error('Post ID is not set.');
    }
  }

 downloadPDF(){

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
  shareContent() {
    alert('Share functionality not implemented yet.');
  }

  editContent() {
    this.router.navigate(['/edit-document', this.postId]);
  }

  paginateContent() {
    this.paginatedContent = this.htmlSplitter.splitHtmlContent(this.content, this.charactersPerPage);
    this.totalPages = this.paginatedContent.length;
    console.log('Total Pages:', this.totalPages); 
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

// generateShareLink() {
//   if (this.postId !== null) {
//     this.http.post<any>(`https://gcccsarco.online/arcoapi/api/sharelink/${this.postId}`, {
//       can_edit: this.canEdit,
//       view_limit: this.viewLimit,
//       destroy_after_view: this.destroyAfterView
//     }).subscribe(data => {
//       console.log('API Response:', data); 
//       if (data.error) {
//         alert(data.error);
//       } else if (data.payload && data.payload.link) {
//         this.shareLink = data.payload.link;
//         console.log('Share Link:', this.shareLink); 
//       } else {
//         console.error('Link not found in the response');
//       }
//     }, error => {
//       console.error('Error generating share link:', error);
//     });
//   } else {
//     console.error('Post ID is not set.');
//   }
// }


generateShareLink() {
  if (this.postId !== null) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.api.generateShareLink(this.postId, this.canEdit, this.viewLimit, this.destroyAfterView, headers).subscribe(
      data => {
        console.log('Share Link API Response:', data);
        if (data.error) {
          alert(data.error);
        } else if (data.payload && data.payload.link) {
          this.shareLink = data.payload.link;
          console.log('Share Link:', this.shareLink);
        } else {
          console.error('Link not found in the response');
        }
      },
      error => {
        console.error('Error generating share link:', error);
      }
    );
  } else {
    console.error('Post ID is not set.');
  }
}



  

  printPage() {
    window.print();
  }

  printPaged() {
    const printContents = this.printSection.nativeElement.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
  
    if (printWindow) {
      printWindow.document.write('<html><head><title>' + this.documentTitle + '</title>');
      printWindow.document.write('<style>@media print { body { margin: 0; } }</style>'); // Add more styles as needed
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window');
    }
  }


  copyToClipboard() {
    const shareLinkInput = document.getElementById('shareLink') as HTMLInputElement;
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); 

    document.execCommand('copy');

    alert('Shareable link copied to clipboard!');
  }
}
