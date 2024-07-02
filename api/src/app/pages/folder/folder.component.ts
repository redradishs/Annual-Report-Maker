import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
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
          } else {
            this.fetchReports(this.folderId);
          }
        });
      } else {
        console.log('No user logged in.');
      }
    });
  }
  

  fetchReports(folderId: number): void {
    this.apiService.getReportsByFolderId(folderId).subscribe(reports => {
      this.documents = reports;
      console.log('Documents:', this.documents);
    });
  }

  retrieveCollaborations() {
    this.apiService.getCollaborations(this.userId!).subscribe(
      (resp: any) => {
        this.collaborationData = resp;
        console.log('Collaboration', this.collaborationData);
      },
      (error) => {
        console.log('error');
      }
    );
  }

  retrieveAllTemplates() {
    this.apiService.getTemplates(this.userId!).subscribe(
      (resp: any) => {
        this.availableTemplates = resp;
      }
    );
  }

}