import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-editfinancialreport',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NavbarComponent, NgIf],
  templateUrl: './editfinancialreport.component.html',
  styleUrl: './editfinancialreport.component.css'
})
export class EditfinancialreportComponent implements OnInit {
  financialReportForm: FormGroup;

  financialReport: any = {};

  financialreport_id: number = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {
    this.financialReportForm = new FormGroup({
      report_title: new FormControl('', Validators.required),
      prepared_by: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      executive_summary: new FormControl('', Validators.required),
      income1: new FormControl('', Validators.required),
      income_salary1: new FormControl('', Validators.required),
      income2: new FormControl(''),
      income_salary2: new FormControl(''),
      expense_item1: new FormControl('', Validators.required),
      expense_amount1: new FormControl('', Validators.required),
      expense_item2: new FormControl(''),
      expense_amount2: new FormControl(''),
      expense_item3: new FormControl(''),
      expense_amount3: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.financialreport_id = parseInt(params.get('id')!, 10);
      this.retrieveEventReport(this.financialreport_id);
    });
  }  

  retrieveEventReport(id: number): void {
    this.apiService.getFinancialReport(id).subscribe(
      (resp: any) => {
        console.log(resp);
        this.financialReport = resp.data;
        this.financialReportForm.patchValue(this.financialReport); // Populate form with retrieved data
      },
      error => {
        console.error('Error fetching event report:', error);
      }
    );
  }

  submitAndNavigate(id: number): void {
    if (this.financialReportForm.valid) {
      const reportData = this.financialReportForm.value; // Use financialReportForm to extract values

      // Post data to the specified endpoint
      this.apiService.editFinancialReport(id, reportData)
        .subscribe(
          (resp) => {
            console.log('Report submitted:', resp);
            // Navigate to the collage creation route upon success
            this.router.navigate(['create/financialreport/view']);
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