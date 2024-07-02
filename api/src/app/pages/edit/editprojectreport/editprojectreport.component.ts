import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-editprojectreport',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, NgFor],
  templateUrl: './editprojectreport.component.html',
  styleUrl: './editprojectreport.component.css'
})
export class EditprojectreportComponent {
  projectForm: FormGroup;
  projectReportStatus: any = {};

  projectID: number = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {
    this.projectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      projectManager: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      statusDesc: new FormControl('', Validators.required),
      overallProgress: new FormControl('', Validators.required),
      milestoneDesc: new FormControl('', Validators.required),
      compeDate: new FormControl('', Validators.required),
      taskDesc: new FormControl('', Validators.required),
      stat: new FormControl('', Validators.required),
      issuesName: new FormControl('', Validators.required),
      issuesPrio: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectID = parseInt(params.get('id')!, 10);
      if (!isNaN(this.projectID)) {
        this.retrieveProjectStatusReport(this.projectID);
      }
    });
  }

  retrieveProjectStatusReport(projectID: number): void {
    this.apiService.getProjectReport(projectID).subscribe(
      (resp: any) => {
        console.log(resp);
        this.projectReportStatus = resp.data;
        this.projectForm.patchValue(this.projectReportStatus); // Populate form with retrieved data
      },
      error => {
        console.error('Error fetching project report:', error);
      }
    );
  }

submitAndNavigate(id: number): void {
    if (this.projectForm.valid) {
      const reportData = this.projectForm.value; // Use annualForm to extract values

      // Post data to the specified endpoint
      this.apiService.editProjectReport(id, reportData)
        .subscribe(
          (resp) => {
            console.log('Updated:', resp);
            // Navigate to the collage creation route upon success
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


  formatDate(date: Date): string {
    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
  }}