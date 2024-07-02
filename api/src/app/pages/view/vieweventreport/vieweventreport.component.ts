import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-vieweventreport',
  standalone: true,
  imports: [NavbarComponent, RouterLink, NgFor, CommonModule],
  templateUrl: './vieweventreport.component.html',
  styleUrls: ['./vieweventreport.component.css']
})
export class VieweventreportComponent implements OnInit {
  eventReport: any = {};
  eventExpenses: any[] = [];
  totalExpenses: number = 0;
  event_id: number = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.event_id = parseInt(params.get('id')!, 10);
      if (!isNaN(this.event_id)) {
        this.retrieveEventReport(this.event_id);
        this.retrieveEventExpenses(this.event_id);
      }
    });
  }

  retrieveEventReport(event_id: number): void {
    this.apiService.getEventReport(event_id).subscribe(
      (resp: any) => {
        console.log(resp);
        this.eventReport = resp.data;
      },
      error => {
        console.error('Error fetching event report:', error);
      }
    );
  }

  retrieveEventExpenses(event_id: number): void {
    this.apiService.getEventExpenses(event_id).subscribe(
      (resp: any) => {
        console.log(resp);
        this.transformExpenses(resp.data);
        this.calculateTotalExpenses();
      },
      error => {
        console.error('Error fetching event expenses:', error);
      }
    );
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