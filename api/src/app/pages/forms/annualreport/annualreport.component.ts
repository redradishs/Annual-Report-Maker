import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-annualreport',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NavbarComponent],
  templateUrl: './annualreport.component.html',
  styleUrl: './annualreport.component.css'
})
export class AnnualreportComponent implements OnInit {
  annualForm: FormGroup;
  userId: number | null = null;

    constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiService: ApiService) {
      this.annualForm = new FormGroup({
        title: new FormControl('', Validators.required), // Required field
        year: new FormControl('', [Validators.required, Validators.min(1900), Validators.max(2100)]), // Number validation
        executive_summary: new FormControl('', Validators.required), // Required field
        company_achievements: new FormControl('', Validators.required), // Required field
        financial_statements: new FormControl(''), // Optional
        management_discussion: new FormControl(''), // Optional
        future_outlook: new FormControl('') // Optional
      });
    }

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

  submitAndNavigate() {
    if (this.annualForm.valid) {
      const reportData = this.annualForm.value; 

      if (this.userId !== null) {
        
        
        this.apiService.submitAnnualReport(this.userId, reportData)
          .subscribe(
            (resp) => {
              console.log('Report submitted:', resp);

              this.router.navigate(['create/annualreport/view']);
            },
            (error) => {
              console.error('Error Submitting Report', error); 
            }
          );
      } else {
        console.error('User ID is not set.');
      }
    } else {
      console.warn('Form is not valid. Check required fields.');
    }
  }
}