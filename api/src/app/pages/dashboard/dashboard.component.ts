import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CreateformComponent } from '../createform/createform.component';
import { SummaryComponent } from '../summary/summary.component';
import { ProfileComponent } from '../profile/profile.component';
import { FlipbookComponent } from '../flipbook/flipbook.component';
import { ReportComponent } from '../report/report.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    RouterOutlet,
    NavbarComponent,
    CreateformComponent,
    ProfileComponent,
    FlipbookComponent,
    ReportComponent,
    CommonModule,
    GoogleChartsModule,
    AdminComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projectReports: any[] = [];
  userId: number | null = null;
  financialReports: any[] = [];

  eventReport: any[] = [];
  annualReport: any[] = [];
  documentReport: any[] = [];

  collaborationData: any[] = [];
  availableTemplates: any[] = [];

  recentActivity: any[] = [];
  recentReports: any[] = [];
  currentUser: string | null = null;

  popularTemplates: any[] = [];
  totalTemplates: number = 0;
  totalReports: number = 0;
  totalCollaboration: number = 0;

  folderCollab = "Collaboration";
  folderTemplates = "Templates";

  private fontAwesomeLink: HTMLLinkElement | null = null;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.retrieveFinancialReport();
        this.retrieveProjectReports();
        this.retrieveAnnualReport();
        this.retriveEventReports();
        this.retrieveDocuments();
        this.retrieveCollaborations();
        this.retrieveAllTemplates();
        this.getUser();
      } else {
        console.log('No user logged in.');
      }
    });

    this.loadFontAwesome();
  }

  ngOnDestroy(): void {
    this.removeFontAwesome();
  }

  //start of data retrieval

  loadFontAwesome() {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    this.renderer.appendChild(document.head, link);
  }

  removeFontAwesome() {
    if (this.fontAwesomeLink) {
      this.renderer.removeChild(document.head, this.fontAwesomeLink);
    }
  }


  retrieveFinancialReport() {
    this.apiService.getFinancialReportss(this.userId!).subscribe(
      (resp: any) => {
        this.financialReports = resp.data;
        this.updateTotalReports();
        this.updateRecentReports();
      },
      (error) => {
        console.log('error');
      }
    );
  }


  retrieveProjectReports() {
    this.apiService.getProjectReportss(this.userId!).subscribe(
      (resp: any) => {
        this.projectReports = resp.data;
        this.updateTotalReports();
        this.updateRecentReports();
      },
      (error) => {
        console.log('error');
      }
    );
  }

  retrieveAnnualReport() {
    this.apiService.getAnnualReportss(this.userId!).subscribe(
      (resp: any) => {
        this.annualReport = resp.data;
        this.updateTotalReports();
        this.updateRecentReports();
      },
      (error) => {
        console.log('error');
      }
    );
  }

  retriveEventReports() {
    this.apiService.getEventReportss(this.userId!).subscribe(
      (resp: any) => {
        this.eventReport = resp.data;
        this.updateTotalReports();
        this.updateRecentReports();
      },
      (error) => {
        console.log('error');
      }
    );
  }

  retrieveDocuments() {
    this.apiService.getDocumentss(this.userId!).subscribe(
      (resp: any) => {
        this.documentReport = resp.data;
        this.updateTotalReports();
        this.updateRecentActivity();
        this.updateRecentReports();
      },
      (error) => {
        console.log('error');
      }
    );
  }

  updateTotalReports(){
    this.totalReports = this.projectReports.length + this.annualReport.length + this.eventReport.length + this.documentReport.length + this.financialReports.length;
  }


  retrieveCollaborations() {
    this.apiService.getCollaborations(this.userId!).subscribe(
      (resp: any) => {
        this.collaborationData = resp;
        this.updateTotalCollab();
        this.updateRecentReports();
        this.updateRecentActivity();
      },
      (error) => {
        console.log('error');
      }
    );
  }

  updateTotalCollab(){
    this.totalCollaboration = this.collaborationData.length;
  }

  retrieveAllTemplates() {
    this.apiService.getTemplates().subscribe(
      (resp: any) => {
        this.availableTemplates = resp;
        this.updateNumberofTemplates();
        this.popularTemplatesList();
      }
    );
  }

  updateNumberofTemplates(){
    this.totalTemplates = this.availableTemplates.length;
  }

  popularTemplatesList(){
    this.popularTemplates = this.availableTemplates
    .sort((a,b) => b.usage_count - a.usage_count)
    .splice(0, 5)

  }

  updateRecentActivity() {
    const documentActivities = this.documentReport
      .filter(doc => doc.edited_at && doc.edited_by !== this.currentUser)
      .map(doc => ({
        description: `Document titled "${doc.title}" edited by ${doc.edited_by || 'Unknown'}`,
        edited_at: doc.edited_at,
        url: `/document/${doc.id}` 
      }));
  
    const collaborationActivities = this.collaborationData
      .filter(collab => collab.created_at)
      .map(collab => ({
        description: `You have been invited to edit "${collab.title}" owned by ${collab.created_by || 'Unknown'}`,
        edited_at: collab.created_at,
        url: `/collaboration/${collab.document_id}` 
      }));
  
    this.recentActivity = [...documentActivities, ...collaborationActivities]
      .sort((a, b) => new Date(b.edited_at).getTime() - new Date(a.edited_at).getTime())
      .slice(0, 3);
  
  }
  

  updateRecentReports() {
    const mapTitle = (report: any, type: string) => {
      switch (type) {
        case 'financial':
          return report.title || 'Untitled Financial Report';
        case 'project':
          return report.projectname || 'Untitled Project Report';
        case 'annual':
          return report.title || 'Untitled Annual Report';
        case 'event':
          return report.event_name || 'Untitled Event Report';
        case 'document':
          return report.title || 'Untitled Document';
        default:
          return 'Untitled Report';
      }
    };
  
    const mapId = (report: any, type: string) => {
      switch (type) {
        case 'financial':
          return report.financialreport_id;
        case 'project':
          return report.projectID;
        case 'annual':
          return report.report_id;
        case 'event':
          return report.event_id;
        case 'document':
          return report.id;
        default:
          return null;
      }
    };
  
    const allReports = [
      ...this.financialReports.map(report => ({ ...report, type: 'financial' })),
      ...this.projectReports.map(report => ({ ...report, type: 'project' })),
      ...this.annualReport.map(report => ({ ...report, type: 'annual' })),
      ...this.eventReport.map(report => ({ ...report, type: 'event' })),
      ...this.documentReport.map(report => ({ ...report, type: 'document' }))
    ];
  

    const collaborationReportIds = this.collaborationData.map(collab => collab.report_id);
  
    this.recentReports = allReports
      .map(report => ({
        ...report,
        id: mapId(report, report.type),
        shared: collaborationReportIds.includes(report.id),
        title: mapTitle(report, report.type),
        url: `/report/${mapId(report, report.type)}`, 
        deleteMethod: this.getDeleteMethod(report.type) 
      }))
      .filter(report => report.id !== null) 
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }
  
  getDeleteMethod(type: string) {
    switch (type) {
      case 'financial':
        return this.deleteFinancialReport.bind(this);
      case 'project':
        return this.deleteprojectStatusReport.bind(this);
      case 'annual':
        return this.deleteAnnualReport.bind(this);
      case 'event':
        return this.deleteEvent.bind(this);
      case 'document':
        return this.deleteReport.bind(this);
      default:
        return () => {};
    }
  }
  
  deleteAnnualReport(report_id: number): void {
    const confirmed = confirm('Are you sure you want to delete this report?');
    if (confirmed) {
      this.apiService.deleteReport(report_id, 'annualreport').subscribe(
        () => {
          this.annualReport = this.annualReport.filter((report: any) => report.report_id !== report_id);
          this.updateRecentReports();
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
      this.apiService.deleteReport(event_id, 'eventreport').subscribe(
        () => {
          this.eventReport = this.eventReport.filter((event: any) => event.event_id !== event_id);
          this.updateRecentReports();
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
      this.apiService.deleteReport(financialreport_id, 'financialreport').subscribe(
        () => {
          this.financialReports = this.financialReports.filter((entry: any) => entry.financialreport_id !== financialreport_id);
          this.updateRecentReports();
        },
        error => {
          console.error('Error deleting financial report:', error);
        }
      );
    }
  }

  deleteprojectStatusReport(projectID: number): void {
    const confirmed = confirm('Are you sure you want to delete this project report?');
    if (confirmed) {
      this.apiService.deleteReport(projectID, 'projectreport').subscribe(
        () => {
          this.projectReports = this.projectReports.filter((entry: any) => entry.projectID !== projectID);
          this.updateRecentReports();
        },
        error => {
          console.error('Error deleting project report:', error);
        }
      );
    }
  }

  deleteReport(reportId: number): void {
    const confirmed = confirm('Are you sure you want to delete this document?');
    if (confirmed) {
      this.apiService.deleteReport(reportId, 'document').subscribe(
        response => {
          this.documentReport = this.documentReport.filter(report => report.id !== reportId);
          this.updateRecentReports();
        },
        error => {
          console.error(`Error deleting report with ID: ${reportId}`, error);
        }
      );
    }
  }
  
  editReport(reportId: number, reportType: string): void {
    switch (reportType) {
      case 'financial':
        this.router.navigate(['/financialreport', reportId]);
        break;
      case 'project':
        this.router.navigate(['/projectreportstatus', reportId]);
        break;
      case 'annual':
        this.router.navigate(['/annualreport', reportId]);
        break;
      case 'event':
        this.router.navigate(['/eventreport', reportId]);
        break;
      case 'document':
        this.router.navigate(['/document', reportId]);
        break;
      default:
        console.error('Unknown report type:', reportType);
    }
  }
  

  getUser() {
    this.apiService.getUsernames(this.userId!).subscribe(
      (resp: any) => {
        this.currentUser = resp;
      }
    );
  }
}
  




