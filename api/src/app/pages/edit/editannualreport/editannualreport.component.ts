import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-editannualreport',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, NavbarComponent, NgIf],
  templateUrl: './editannualreport.component.html',
  styleUrl: './editannualreport.component.css'
})
export class EditannualreportComponent implements OnInit{
  annualForm: FormGroup;
  annualReport: any = {};


  reportId: number = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService){
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
    this.route.paramMap.subscribe(params => {
      this.reportId = parseInt(params.get('id')!, 10);
      if (!isNaN(this.reportId)) {
        this.retrieveAnnualReport(this.reportId);
      }
    });
  }


  retrieveAnnualReport(id: number): void {
    this.apiService.getAnnualReport(id).subscribe(
      (resp: any) => {
        console.log(resp);
        this.annualReport = resp.data;
        this.annualForm.patchValue(this.annualReport); // Populate form with retrieved data
      },
      error => {
        console.error('Error fetching event report:', error);
      }
    );
  }



  submitAndNavigate(id: number): void {
    if (this.annualForm.valid) {
      const reportData = this.annualForm.value; // Use annualForm to extract values

      // Post data to the specified endpoint
      this.apiService.editAnnualReport(id, reportData)
        .subscribe(
          (resp) => {
            console.log('Updated:', resp);

            this.router.navigate(['summary']);
            
          },
          (error) => {
            console.error('Error Submitting Report', error); // Handle errors
          }
        );
    } else {
      console.warn('Form is not valid. Check required fields.');
    }
  }
}

