import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-editeventreport',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, NavbarComponent, NgIf],
  templateUrl: './editeventreport.component.html',
  styleUrl: './editeventreport.component.css'
})
export class EditeventreportComponent implements OnInit {
  eventForm: FormGroup;

  eventReport: any = {};
  eventId: number = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {
    this.eventForm = new FormGroup({
      event_name: new FormControl('', Validators.required),
      event_date: new FormControl(''),
      event_title: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      expected_participants: new FormControl('', Validators.required),
      total_participants: new FormControl('', Validators.required),
      summary: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = parseInt(params.get('id')!, 10);
      this.retrieveEventReport(this.eventId);
    });
  }

  retrieveEventReport(id: number): void {
    this.apiService.getEventReport(id).subscribe(
      (resp: any) => {
        console.log(resp);
        this.eventReport = resp.data;
        this.eventForm.patchValue(this.eventReport); // Populate form with retrieved data
      },
      error => {
        console.error('Error fetching event report:', error);
      }
    );
  }

  submitAndNavigate(id: number): void {
    if (this.eventForm.valid) {
      const reportData = this.eventForm.value; // Use eventForm to extract values

      // Post data to the specified endpoint
      this.apiService.editEventReport(id, reportData)
        .subscribe(
          (resp) => {
            console.log('Report submitted:', resp);
            this.router.navigate(['summary']);
            // Navigate to the event report view route upon success
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