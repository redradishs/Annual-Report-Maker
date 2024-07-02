import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import  flatpickr  from 'flatpickr';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChatbotLoaderService } from '../../services/chatbot-loader.service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Report {
  report_id: number;
  created_at: string;
  title: string;
}

interface Event {
  event_id: number;
  event_date: string;
  event_name: string;
}

interface FinancialReport {
  financialreport_id: number;
  start_date: string;
  report_title: string;
}

interface ProjectStatusReport {
  startDate: string | number | Date;
  financialreport_id: number;
  start_date: string;
  report_title: string;
  projectID: number;
  projectName: string;
}

interface DocumentReport {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterLink,RouterModule, RouterOutlet, NavbarComponent, NgFor, NgIf, DatePipe, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  providers: [DatePipe, JsonPipe]
})
export class SummaryComponent implements AfterViewInit, OnDestroy, OnInit {
  userId: number | null = null;

  [x: string]: any;

  searchTerm: string = '';
  showFilteredResults: boolean = false;



  private dateRangePicker: flatpickr.Instance | null = null; // Initialize with null
    filteredAnnualReport: Report[] = [];
    filteredEventReport: Event[] = [];
    filteredFinancialReport: FinancialReport[] = [];
    filteredProjectReport: ProjectStatusReport[] = [];
    annualReport: any = {};
    eventReport: any = {}
    financialReport: any = {}
    projectStatusReport: any ={}
    documentReport: any[] = [];
    filteredDocumentReport: DocumentReport[] = [];

    constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, 
      private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object,
  private chatbotloader: ChatbotLoaderService, private apiService: ApiService) {
      this.annualReport = [];
      this.eventReport = [];
      this.financialReport = [];
      this.projectStatusReport = [];

      // this.retrieveAnnualReport();
      // this.retrieveEventReport();
      // this.retrieveFinancialReport();
      // this.retrieveProjectStatusReport();
    }



    ngOnInit(): void {
      this.chatbotloader.loadScript(); 

      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          this.userId = user.id;
          console.log('User ID:', this.userId);
          this.retrieveAnnualReport();
          this.retrieveEventReport();
          this.retrieveFinancialReport();
          this.retrieveProjectStatusReport();
          this.retrieveDocuments();
        } else {
          console.log('No user logged in.');
        }
      });

      this.applySearchFilter();
    }


    
    filterReports(): void {
      const term = this.searchTerm.toLowerCase();
      this.filteredAnnualReport = this.annualReport.filter((report: Report) => report.title.toLowerCase().includes(term));
      this.filteredEventReport = this.eventReport.filter((event: Event) => event.event_name.toLowerCase().includes(term));
      this.filteredFinancialReport = this.financialReport.filter((finance: FinancialReport) => finance.report_title.toLowerCase().includes(term));
      this.filteredProjectReport = this.projectStatusReport.filter((project: ProjectStatusReport) => project.report_title.toLowerCase().includes(term));
      
    }

    applyDateFilter(): void {
      if (this.dateRangePicker) {
        const selectedDates = this.dateRangePicker.selectedDates as Date[];
        if (selectedDates.length === 2) {
          const [start, end] = selectedDates;
    
          this.filteredAnnualReport = this.annualReport.filter((report: Report) => {
            const reportDate = new Date(report.created_at);
            return reportDate >= start && reportDate <= end;
          });
    
          this.filteredFinancialReport = this.financialReport.filter((finance: FinancialReport) => {
            const financeDate = new Date(finance.start_date);
            return financeDate >= start && financeDate <= end;
          });
    
          this.filteredEventReport = this.eventReport.filter((event: Event) => {
            const eventDate = new Date(event.event_date);
            return eventDate >= start && eventDate <= end;
          });
    
          this.filteredProjectReport = this.projectStatusReport.filter((project: ProjectStatusReport) => {
            const startDate = new Date(project.startDate);
            return startDate >= start && startDate <= end;
          });

          this.filteredDocumentReport = this.documentReport.filter((document: Report) => {
            const documentDate = new Date(document.created_at);
            return documentDate >= start && documentDate <= end;
          });
    
          this.showFilteredResults = true;
        }
      }
    }
    
    applySearchFilter(): void {
      const term = this.searchTerm.toLowerCase();
      
      if (term === '') {
        this.filteredAnnualReport = [];
        this.filteredEventReport = [];
        this.filteredFinancialReport = [];
        this.filteredProjectReport = [];
        this.filteredDocumentReport = [];
      } else {
        this.filteredAnnualReport = this.annualReport.filter((report: Report) => report.title.toLowerCase().includes(term));
        this.filteredEventReport = this.eventReport.filter((event: Event) => event.event_name.toLowerCase().includes(term));
        this.filteredFinancialReport = this.financialReport.filter((finance: FinancialReport) => finance.report_title.toLowerCase().includes(term));
        this.filteredProjectReport = this.projectStatusReport.filter((project: ProjectStatusReport) => project.projectName.toLowerCase().includes(term));
        this.filteredDocumentReport = this.documentReport.filter((document: Report) => document.title.toLowerCase().includes(term));
      }
    
      this.showFilteredResults = true;
    }
    
    

    deleteReport(report_id: number): void {
      const confirmed = confirm('Are you sure you want to delete this report?');
      if (confirmed) {
        this.apiService.deleteAnnualReport(report_id).subscribe(
          () => {
            this.annualReport = this.annualReport.filter((report: any) => report.report_id !== report_id);
          },
          error => {
            console.error('Error deleting report:', error);
          }
        );
      }
    }
    
    deleteEvent(event_id: number): void {
      const confirmed = confirm('Are you sure you want to delete this event?');
      if (confirmed) {
        this.apiService.deleteEventReport(event_id).subscribe(
          () => {
            this.eventReport = this.eventReport.filter((event: any) => event.event_id !== event_id);
          },
          error => {
            console.error('Error deleting event:', error);
          }
        );
      }
    }
    
    deleteFinancialReport(financialreport_id: number): void {
      const confirmed = confirm('Are you sure you want to delete this financial report?');
      if (confirmed) {
        this.apiService.deleteFinancialReport(financialreport_id).subscribe(
          () => {
            this.financialReport = this.financialReport.filter((entry: any) => entry.financialreport_id !== financialreport_id);
          },
          error => {
            console.error('Error deleting financial report:', error);
          }
        );
      }
    }
    
    deleteProjectStatusReport(projectID: number): void {
      const confirmed = confirm('Are you sure you want to delete this Project report?');
      if (confirmed) {
        this.apiService.deleteProjectReport(projectID).subscribe(
          () => {
            this.projectStatusReport = this.projectStatusReport.filter((entry: any) => entry.projectID !== projectID);
          },
          error => {
            console.error('Error deleting Project report:', error);
          }
        );
      }
    }

    deleteDocumentReport(reportId: number): void {
      const confirmed = confirm('Are you sure you want to delete this document?');
      if (confirmed) {
        this.apiService.deleteReport(reportId, 'document').subscribe(
          response => {
            console.log(`Deleted report with ID: ${reportId}`);
            this.documentReport = this.documentReport.filter(report => report.id !== reportId);
          },
          error => {
            console.error(`Error deleting report with ID: ${reportId}`, error);
          }
        );
      }
    }
    
    retrieveAnnualReport() {
      if (this.userId !== null) {
        this.apiService.getAnnualReports(this.userId).subscribe(
          (resp: any) => {
            console.log('Annual reports:', resp);
            this.annualReport = resp.data;
          },
          (error) => {
            console.error('Error retrieving annual reports:', error);
          }
        );
      }
    }
    
    retrieveEventReport() {
      if (this.userId !== null) {
        this.apiService.getEventReports(this.userId).subscribe(
          (resp: any) => {
            console.log('Event reports:', resp);
            this.eventReport = resp.data;
          },
          (error) => {
            console.error('Error retrieving event reports:', error);
          }
        );
      }
    }
    
    retrieveFinancialReport() {
      if (this.userId !== null) {
        this.apiService.getFinancialReports(this.userId).subscribe(
          (resp: any) => {
            console.log('Financial reports:', resp);
            this.financialReport = resp.data;
          },
          (error) => {
            console.error('Error retrieving financial reports:', error);
          }
        );
      }
    }
    
    retrieveProjectStatusReport() {
      if (this.userId !== null) {
        this.apiService.getProjectReports(this.userId).subscribe(
          (data: any) => {
            console.log('Project status reports:', data);
            this.projectStatusReport = data.data.map((item: any) => ({
              projectID: item.projectID,
              startDate: item.startDate,
              projectName: item.projectName,
              projectManager: item.projectManager
            }));
          },
          (error) => {
            console.error('Error retrieving project status reports:', error);
          }
        );
      }
    }

    retrieveDocuments(){
      this.apiService.getDocuments(this.userId!).subscribe(
        (resp: any) => {
          this.documentReport = resp.data;
          console.log("documents", this.documentReport);
        }, (error) => {
          console.error('Error retrieving documents:', error);
        }
      );
    }
    


  
    formatDate(date: string): string | null {
      const transformedDate = this.datePipe.transform(date, 'EEEE'); // Output like "Sunday, May 17, 2023"
      return transformedDate !== null ? transformedDate : null;
    }

    formatDate1(date: string): string | null {
      const transformedDate = this.datePipe.transform(date, 'd');  // Output like "Sunday, May 17, 2023"
      return transformedDate !== null ? transformedDate : null;
    }

    formatDate2(date: string): string | null {
      const transformedDate = this.datePipe.transform(date, 'MMMM d');  // Output like "Sunday, May 17, 2023"
      return transformedDate !== null ? transformedDate : null;
    }
    ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        const pickerInstance = flatpickr('#date-range-icon', {
          mode: 'range',
          dateFormat: 'F j, Y',
          onChange: (selectedDates: Date[]) => {
            this.updateSelectedRangeText(selectedDates);
          },
        });
        this.dateRangePicker = Array.isArray(pickerInstance) ? pickerInstance[0] : pickerInstance;
      }
    }
  
    ngOnDestroy() {
      if (this.dateRangePicker) {
        this.dateRangePicker.destroy();
        this.dateRangePicker = null; // Ensures cleanup
      }
    }

    
  
   
  private updateSelectedRangeText(selectedDates: Date[]): void {
    const selectedRange = selectedDates
      .map(date => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
      .join(' to ');

    const selectedRangeElement = document.getElementById('selected-range');
    if (selectedRangeElement) {
      selectedRangeElement.textContent = `${selectedRange}`;
    }

    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;

      this.filteredAnnualReport = this.annualReport.filter((report: Report) => {
        const reportDate = new Date(report.created_at);
        return reportDate >= start && reportDate <= end;
      });

      this.filteredFinancialReport = this.financialReport.filter((finance: FinancialReport) => {
        const financeDate = new Date(finance.start_date);
        return financeDate >= start && financeDate <= end;
      });

      this.filteredEventReport = this.eventReport.filter((event: Event) => {
        const eventDate = new Date(event.event_date);
        return eventDate >= start && eventDate <= end;
      });

      this.filteredProjectReport = this.projectStatusReport.filter((project: ProjectStatusReport) => {
        const startDate = new Date(project.startDate);
        return startDate >= start && startDate <= end;
      });
      
      
      }
      
  }
  
  setDayRange(): void {
    if (this.dateRangePicker) {
      const today = new Date();
      this.dateRangePicker.setDate([today, today]);
      this.updateSelectedRangeText([today]);
    }
  }
  
  setWeekRange(): void {
    if (this.dateRangePicker) {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
      this.dateRangePicker.setDate([startOfWeek, endOfWeek]);
      this.updateSelectedRangeText([startOfWeek, endOfWeek]);
    }
  }
  
  setMonthRange(): void {
    if (this.dateRangePicker) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.dateRangePicker.setDate([startOfMonth, endOfMonth]);
      this.updateSelectedRangeText([startOfMonth, endOfMonth]);
    }
  }
  
  setYearRange(): void {
    if (this.dateRangePicker) {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      this.dateRangePicker.setDate([startOfYear, endOfYear]);
      this.updateSelectedRangeText([startOfYear, endOfYear]);
    }
  }
}