import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-eventreportoutput',
  standalone: true,
  imports: [NavbarComponent, FormsModule, NgFor, CommonModule],
  templateUrl: './eventreportoutput.component.html',
  styleUrl: './eventreportoutput.component.css'
})
export class EventreportoutputComponent implements OnInit {
      
    eventReport: any = {};
    eventExpenses: any[] = [];
    userId: number | null = null;
    totalExpenses: number = 0;
  
    constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService) {}
  
    ngOnInit(): void {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          this.userId = user.id;
          console.log('User ID:', this.userId);
          this.retrieveEventReport();
          this.retrieveEventExpenses();
        } else {
          console.log('No user logged in.');
        }
      });
    }
  
    retrieveEventReport() {
      if (this.userId !== null) {
        this.apiService.retrieveEventReport(this.userId).subscribe(
          (resp: any) => {
            console.log(resp);
            this.eventReport = resp.data;
          },
          (error) => {
            console.error('Error fetching event report:', error);
          }
        );
      } else {
        console.error('User ID is not set.');
      }
    }
  
    retrieveEventExpenses() {
      if (this.userId !== null) {
        this.apiService.retrieveEventExpenses(this.userId).subscribe(
          (resp: any) => {
            console.log(resp);
            this.transformExpenses(resp.data);
            this.calculateTotalExpenses();
          },
          (error) => {
            console.error('Error fetching event expenses:', error);
          }
        );
      } else {
        console.error('User ID is not set.');
      }
    }
  
    transformExpenses(data: any) {
      this.eventExpenses = [];
      for (let i = 1; i <= 10; i++) {
        if (data[`expense_item${i}`] || data[`expense_amount${i}`]) {
          this.eventExpenses.push({
            item: data[`expense_item${i}`],
            amount: data[`expense_amount${i}`]
          });
        }
      }
    }
  
    calculateTotalExpenses() {
      this.totalExpenses = this.eventExpenses.reduce((total, expense) => {
        return total + (parseFloat(expense.amount) || 0);
      }, 0);
    }
  
    downloadPDF(): void {
      const element = document.querySelector('.reportdata') as HTMLElement;
      if (element) {
        html2canvas(element, { scale: 3 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = pdfWidth;
          const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
          // Check if the height of the image exceeds the height of the PDF page
          if (imgHeight > pdfHeight) {
            const scale = pdfHeight / imgHeight;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * scale, imgHeight * scale);
          } else {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          }
  
          pdf.save('event_report.pdf');
        });
      }
    }
    
    
  }