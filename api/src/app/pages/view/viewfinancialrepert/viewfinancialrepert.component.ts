import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-viewfinancialrepert',
  standalone: true,
  imports: [NavbarComponent, RouterLink, NgFor, NgIf, CommonModule],
  templateUrl: './viewfinancialrepert.component.html',
  styleUrl: './viewfinancialrepert.component.css'
})
export class ViewfinancialrepertComponent {
  
  financialreport_id: number = 0;

  financialReport: any = {
    reportId: '',
    dateCreated: '',
    preparedBy: '',
    startDate: '',
    endDate: '',
    reportTitle: '',
    incomes: [],
    expenses: [],
    totalIncome: '',
    totalSpendings: '',
    executiveSummary: ''
  };

  userId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.financialreport_id = parseInt(params.get('id')!, 10);
      if (!isNaN(this.financialreport_id)) {
        this.authService.getCurrentUser().subscribe(user => {
          if (user) {
            this.userId = user.id;
            this.retrieveFinancialReport(this.financialreport_id);
          } else {
            console.error('No user logged in.');
          }
        });
      }
    });
  }

  retrieveFinancialReport(financialreport_id: number): void {
    if (this.userId !== null) {
      this.apiService.getFinancialReport(financialreport_id).subscribe(
        (resp: any) => {
          console.log(resp);
          const data = resp.data;
          const totalIncome = this.calculateTotalIncome(data);
          const totalSpendings = this.calculateTotalSpendings(data);
          this.financialReport = {
            reportId: data.financialreport_id,
            dateCreated: data.date_created,
            preparedBy: data.prepared_by,
            startDate: data.start_date,
            endDate: data.end_date,
            reportTitle: data.report_title,
            incomes: this.extractIncomes(data),
            expenses: this.extractExpenses(data),
            totalIncome: totalIncome,
            totalSpendings: totalSpendings,
            netIncome: totalIncome - totalSpendings,
            executiveSummary: data.executive_summary
          };
        },
        (error) => {
          console.error('Error fetching financial report:', error);
        }
      );
    } else {
      console.error('User ID is not set.');
    }
  }


  extractIncomes(data: any): any[] {
    const incomes = [];
    for (let i = 1; i <= 10; i++) {
      if (data[`income${i}`] && data[`income_salary${i}`]) {
        incomes.push({ source: data[`income${i}`], amount: data[`income_salary${i}`] });
      }
    }
    return incomes;
  }

  extractExpenses(data: any): any[] {
    const expenses = [];
    for (let i = 1; i <= 10; i++) {
      if (data[`expense_item${i}`] && data[`expense_amount${i}`]) {
        expenses.push({ item: data[`expense_item${i}`], amount: data[`expense_amount${i}`] });
      }
    }
    return expenses;
  }

  calculateTotalIncome(data: any): number {
    let total = 0;
    for (let i = 1; i <= 10; i++) {
      total += parseFloat(data[`income_salary${i}`]) || 0;
    }
    return total;
  }

  calculateTotalSpendings(data: any): number {
    let total = 0;
    for (let i = 1; i <= 10; i++) {
      total += parseFloat(data[`expense_amount${i}`]) || 0;
    }
    return total;
  }

  downloadPDF() {
    const report = document.querySelector('#report') as HTMLElement;
    html2canvas(report).then(canvas => {
      const doc = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
      doc.save('financial_report.pdf');
    });
  }
}