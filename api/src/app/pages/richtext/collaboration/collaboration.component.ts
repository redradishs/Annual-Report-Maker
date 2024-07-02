  import { Component, OnInit } from '@angular/core';
  import { NavbarComponent } from '../../navbar/navbar.component';
  import { Router } from '@angular/router';
  import { HttpClient } from '@angular/common/http';
  import { AuthService } from '../../../services/auth.service';
  import { NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';


  @Component({
    selector: 'app-collaboration',
    standalone: true,
    imports: [NavbarComponent, NgFor],
    templateUrl: './collaboration.component.html',
    styleUrl: './collaboration.component.css'
  })
  export class CollaborationComponent implements OnInit {

    collab: any[] = [];
    
    userId: number | null = null;

    
    constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiService: ApiService) {}


    ngOnInit(): void {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          this.userId = user.id;
          console.log('User ID:', this.userId);
          this.fetchCollab();
        } else {
          console.log('No user logged in.');
        }
      });
    }



    fetchCollab(): void {
      if (this.userId === null) {
        console.error('User ID is null. Cannot fetch documents.');
        return;
      }
    
      this.apiService.fetchCollab(this.userId)
        .subscribe({
          next: (response) => {
            console.log('API response:', response); 
    
            if (Array.isArray(response)) {
              // Sort the documents by collab_id in descending order
              const sortedDocuments = response.sort((a, b) => b.collab_id - a.collab_id);
    
              this.collab = sortedDocuments.slice(0, 4);
              console.log('Fetched documents:', this.collab);
            } else {
              console.error('Unexpected response structure:', response);
            }
          },
          error: (err) => console.error(err)
        });
    }
    








    
    redirectToPage() {
      this.router.navigate(['/document']); 
    }

    createDocument(documentId: string) {
      console.log('Document ID:', documentId);
    }


    onDocumentClick(documentId: number) {
      console.log('Document ID clicked:', documentId);
      this.router.navigate(['collaboration/view/', documentId]); 
    }
  }
