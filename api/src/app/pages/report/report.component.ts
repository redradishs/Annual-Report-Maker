import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { GoogleChartsModule } from 'angular-google-charts';
import { CommonModule, NgFor } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { BackComponent } from '../../addons/back/back.component';

interface Folder {
  folder_id?: number;
  user_id: number;
  folder_name: string;
  created_at?: string;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NavbarComponent, RouterLink, RouterOutlet, RouterModule, GoogleChartsModule, NgFor, CommonModule, BackComponent],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  userId: number | null = null;
  staticFolders: Folder[] = [
    { user_id: 0, folder_name: 'Collaboration' },
    { user_id: 0, folder_name: 'Templates' }
  ];
  userFolders: Folder[] = [];

  unfolderedRichtext: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.fetchFolders();
        this.fetchUnfolderedRichtext();
      } else {
        console.log('No user logged in.');
      }
    });
  }

  fetchFolders(): void {
    if (this.userId !== null) {
      this.apiService.getFolders(this.userId).subscribe(
        (resp: any) => {
          if (resp.success && Array.isArray(resp.folders)) {
            this.userFolders = resp.folders;
          } else {
            this.userFolders = [];
          }
          console.log('Folders:', this.userFolders);
        },
        (error) => {
          console.error('Error fetching folders:', error);
        }
      );
    }
  }
  

  addNewFolder(): void {
    const folderName = prompt('Enter folder name:');
    if (folderName && this.userId !== null) {
      const newFolder: Folder = { user_id: this.userId, folder_name: folderName };
      this.apiService.createFolder(newFolder, this.userId).subscribe(folder => {
        this.userFolders.push(folder);
        this.fetchFolders();
      });
    }
  }

  deleteFolder(folderId: number | undefined): void {
    if (folderId === undefined) {
      console.error('Folder ID is undefined');
      return;
    }

    if (confirm('Are you sure you want to delete this folder?')) {
      this.apiService.deleteFolder(folderId).subscribe(() => {
        this.userFolders = this.userFolders.filter(folder => folder.folder_id !== folderId);
      });
    }
  }

  fetchUnfolderedRichtext(): void {
    if (this.userId !== null) {
      this.apiService.getUnfolderedRichtext(this.userId).subscribe(
        (resp: any) => {
          this.unfolderedRichtext = resp;
        },
        (error) => {
          console.error('Error fetching unfoldered richtext entries:', error);
        }
      );
    }
  }

  assignToFolder(reportId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const folderId = Number(selectElement.value);
    if (this.userId !== null) {
      this.apiService.assignReportToFolder(this.userId, reportId, folderId).subscribe(response => {
        console.log('Assign response:', response);
        if (response.success) {
          this.fetchFolders();
          this.fetchUnfolderedRichtext();
        }
      });
    }
  }


  deleteDocumentReport(reportId: number): void {
    const confirmed = confirm('Are you sure you want to delete this document?');
    if (confirmed) {
      this.apiService.deleteReport(reportId, 'document').subscribe(
        response => {
          console.log(`Deleted report with ID: ${reportId}`);
          this.fetchUnfolderedRichtext();
        },
        error => {
          console.error(`Error deleting report with ID: ${reportId}`, error);
        }
      );
    }
  }
  


}
