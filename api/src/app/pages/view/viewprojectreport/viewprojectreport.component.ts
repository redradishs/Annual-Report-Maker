import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-viewprojectreport',
  standalone: true,
  imports: [NavbarComponent, NgFor, RouterLink],
  templateUrl: './viewprojectreport.component.html',
  styleUrl: './viewprojectreport.component.css'
})
export class ViewprojectreportComponent {

  projectStatusReport: any = {};
  projectID: number = 0;
  data: any = {};

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectID = parseInt(params.get('id')!, 10);
      if (!isNaN(this.projectID)) {
        this.retrieveProjectStatusReport(this.projectID);
      }
    });
  }


  retrieveProjectStatusReport(projectID: number): void {
    this.apiService.getProjectStatusReport(projectID).subscribe(
      (resp: any) => {
        console.log(resp);
        this.projectStatusReport = resp.data;
        this.projectStatusReport.patchValue(this.projectStatusReport); // Populate form with retrieved data
      },
      error => {
        console.error('Error fetching Project Status report:', error);
      }
    );
  }


  downloadPDF() {
    // Use type assertion to ensure the element is an HTMLElement
    const reportData = document.querySelector('.reportdata') as HTMLElement;

    if (reportData) {
      html2canvas(reportData, { scale: 2, useCORS: true }).then((canvas) => {
        const pdfWidth = canvas.width + 80; // Additional space to prevent cutting
        const pdfHeight = canvas.height + 80;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [pdfWidth, pdfHeight], // Ensure ample space to avoid cutting
        });

        const margin = 40; // Margin for padding around the content
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', margin, margin, canvas.width, canvas.height);
        pdf.save('Financial_Report.pdf');
      });
    } else {
      console.error('The report data container was not found.');
    }
  }
}
