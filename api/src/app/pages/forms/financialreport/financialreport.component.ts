import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-financialreport',
  standalone: true,
  imports: [NavbarComponent, NgIf, ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './financialreport.component.html',
  styleUrl: './financialreport.component.css'
})
export class FinancialreportComponent {
  userId: number | null = null;
  financialReportForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private authService: AuthService, private apiService: ApiService) {
    this.financialReportForm = this.fb.group({
      report_title: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      prepared_by: ['', Validators.required],
      incomes: this.fb.array([]),
      expenses: this.fb.array([]),
      executive_summary: ['']
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

    this.addIncome();
    this.addExpense();
  }

  get incomes(): FormArray {
    return this.financialReportForm.get('incomes') as FormArray;
  }

  get expenses(): FormArray {
    return this.financialReportForm.get('expenses') as FormArray;
  }

  addIncome(): void {
    this.incomes.push(this.fb.group({
      source: ['', Validators.required],
      amount: ['', Validators.required]
    }));
  }

  removeIncome(index: number): void {
    this.incomes.removeAt(index);
  }

  addExpense(): void {
    this.expenses.push(this.fb.group({
      item: ['', Validators.required],
      amount: ['', Validators.required]
    }));
  }

  removeExpense(index: number): void {
    this.expenses.removeAt(index);
  }
  submitAndNavigate() {
    if (this.financialReportForm.valid) {
      const formData = this.financialReportForm.value;
  
      const reportData = {
        report_title: formData.report_title,
        start_date: formData.start_date,
        end_date: formData.end_date,
        prepared_by: formData.prepared_by,
        executive_summary: formData.executive_summary,
        ...this.mapIncomes(formData.incomes),
        ...this.mapExpenses(formData.expenses)
      };
  
      if (this.userId !== null) {
        this.apiService.submitFinancialReport(this.userId, reportData)
          .subscribe(
            (resp) => {
              console.log('Report submitted:', resp);
              this.router.navigate(['create/financialreport/view']);
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
  
  mapIncomes(incomes: any[]): any {
    const incomeData: any = {};
    for (let i = 0; i < 10; i++) {
      incomeData[`income${i + 1}`] = incomes[i]?.source || '';
      incomeData[`income_salary${i + 1}`] = incomes[i]?.amount || '';
    }
    return incomeData;
  }
  
  mapExpenses(expenses: any[]): any {
    const expenseData: any = {};
    for (let i = 0; i < 10; i++) {
      expenseData[`expense_item${i + 1}`] = expenses[i]?.item || '';
      expenseData[`expense_amount${i + 1}`] = expenses[i]?.amount || '';
    }
    return expenseData;
  }
}