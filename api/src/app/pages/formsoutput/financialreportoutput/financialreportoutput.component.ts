import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-financialreportoutput',
  standalone: true,
  imports: [NavbarComponent, NgFor, NgIf, CommonModule],
  templateUrl: './financialreportoutput.component.html',
  styleUrl: './financialreportoutput.component.css'
})
export class FinancialreportoutputComponent implements OnInit {


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

  constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService ) { }


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.retrieveFinancialReport();
      } else {
        console.log('No user logged in.');
      }
    });
  }retrieveFinancialReport() {
    if (this.userId !== null) {
      this.apiService.retrieveFinancialReport(this.userId).subscribe(
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




// retrieveAnnualReport(financialreport_id: number): void {
//   this.http.get(`https://gcccsarco.online/arcoapi/api/finacialreportonly/${financialreport_id}`).subscribe(
//     (resp: any) => {
//       console.log(resp);
//       this.financialReport = resp.data;
//       this.financialReport.patchValue(this.financialReport); // Populate form with retrieved data
//     },
//     error => {
//       console.error('Error fetching Annual report:', error);
//     }
//   );
// }