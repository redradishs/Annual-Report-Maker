import { Component, OnInit } from '@angular/core';
import { SummaryComponent } from '../summary/summary.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ReportComponent } from '../report/report.component';
import { FlipbookComponent } from '../flipbook/flipbook.component';
import { ProfileComponent } from '../profile/profile.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-createform',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './createform.component.html',
  styleUrl: './createform.component.css'
})
export class CreateformComponent implements OnInit {
  documents: any[] = [];
  userId: number | null = null;
  availableTemplates: any[] = [];


  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.retrieveAllTemplates();
      } else {
        console.log('No user logged in.');
      }
    });
  }


  fetchDocuments(): void {
    if (this.userId === null) {
      console.error('User ID is null. Cannot fetch documents.');
      return;
    }
  


      this.apiService.getDocuments(this.userId).subscribe({
        next: (response) => {
          console.log('API response:', response); 
  
          if (response.remarks === 'Success' && Array.isArray(response.data)) {
            const sortedDocuments = response.data.sort((a: { created_at: string }, b: { created_at: string }) => {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
  
            this.documents = sortedDocuments.slice(0, 4);
            console.log('Fetched documents:', this.documents);
          } else {
            console.error('Unexpected response structure:', response);
          }
        },
        error: (err) => console.error(err)
      });
  }


  retrieveAllTemplates() {
    this.apiService.getTemplates(this.userId!).subscribe(
      (resp: any) => {
        this.availableTemplates = resp
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4); 
        console.log('Templates: ', this.availableTemplates);
      }
    );
  }
  
  
  


  redirectToPage() {
    this.router.navigate(['/document']); 
  }

  createDocument(documentId: string) {
    console.log('Document ID:', documentId);
  }


  onTemplateClick(templateId: number) {
    console.log('Template ID clicked:', templateId);
    this.router.navigate(['create/template/view/', templateId]); 
  }
}