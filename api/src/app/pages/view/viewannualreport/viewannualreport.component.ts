import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-viewannualreport',
  standalone: true,
  imports: [NavbarComponent, RouterLink, NgFor],
  templateUrl: './viewannualreport.component.html',
  styleUrl: './viewannualreport.component.css'
})
export class ViewannualreportComponent {
  annualReport: any = {};
  report_id: number = 0;
  data: any = {};

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.report_id = parseInt(params.get('id')!, 10);
      if (!isNaN(this.report_id)) {
        this.retrieveAnnualReport(this.report_id);
      }
    });
  }


  retrieveAnnualReport(report_id: number): void {
    this.apiService.getAnnualReport(report_id).subscribe(
      (resp: any) => {
        console.log(resp);
        this.annualReport = resp.data;
      },
      error => {
        console.error('Error fetching Annual report:', error);
      }
    );
  }

  deleteReport(report_id: number): void {
    const confirmed = confirm('Are you sure you want to delete this report?');
    if (confirmed) {
      this.apiService.deleteAnnualReport(report_id).subscribe(
        () => {
          this.router.navigate(['/annualreports']); // Assuming you navigate to the annual reports list after deletion
        },
        error => {
          console.error('Error deleting report:', error);
        }
      );
    }
  }


  downloadPDF(): void {
    const element = document.querySelector('.report-container') as HTMLElement;
    if (element) {
      html2canvas(element, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('annual_report.pdf');
      });
    }
  }
}