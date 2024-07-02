import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-annualreportoutput',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './annualreportoutput.component.html',
  styleUrl: './annualreportoutput.component.css'
})
export class AnnualreportoutputComponent {

  annualReport: any = {};
  data: any;

  userId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.retrieveAnnualReport();
      } else {
        console.log('No user logged in.');
      }
    });
  }

  

  retrieveAnnualReport() {
    if (this.userId !== null) {
      this.apiService.retrieveAnnualReport(this.userId).subscribe(
        (resp: any) => {
          console.log(resp);
          this.data = resp.payload;
          this.annualReport = resp.data;
        }, (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      console.error('User ID is not set.');
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