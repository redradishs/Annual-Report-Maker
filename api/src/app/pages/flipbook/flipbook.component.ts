import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { SummaryComponent } from '../summary/summary.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ReportComponent } from '../report/report.component';
import { ProfileComponent } from '../profile/profile.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CollageComponent } from '../collage/collage.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [SummaryComponent, NavbarComponent, RouterLink, RouterOutlet, RouterModule, ReportComponent, ProfileComponent, CommonModule],
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css']
})
export class FlipbookComponent implements OnInit, AfterViewInit {

  @ViewChild('book') bookElement!: ElementRef<HTMLElement>;
  @ViewChild('prevBtn') prevBtnElement!: ElementRef<HTMLElement>;
  @ViewChild('nextBtn') nextBtnElement!: ElementRef<HTMLElement>;

  userId: number | null = null;
  currentLocation = 1;
  collageData: any[] = [];
  paginatedData: any[] = [];

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) {}


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only execute this code on the client side
      if (this.bookElement && this.prevBtnElement && this.nextBtnElement) {
        // Perform any necessary initialization here
      }
    }
  }


  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.retrieveEventReport();
      } else {
        console.log('No user logged in.');
      }
    });
  }


  retrieveEventReport() {
    if (this.userId !== null) {
      
      this.apiService.getCollageData(this.userId).subscribe(
        (resp: any) => {
          this.collageData = resp.data.map((item: any) => {
  
            const cleanedImagePath = item.image_path.replace(/^\.\.\//, '');
            const imageUrl = this.apiService.cleanedFlipbook(item.image_path);
            
     
            console.log('Generated Image URL:', imageUrl);
  
            return {
              ...item,
              imageUrl
            };
          });
          this.paginateData();
        },
        error => console.error('Error fetching data:', error)
      );
    }
  }
  
  

  paginateData() {
    this.paginatedData = [];
    for (let i = 0; i < this.collageData.length; i += 2) {
      this.paginatedData.push({
        front: this.collageData[i],
        back: this.collageData[i + 1] || null
      });
    }
  }
  openBook() {
    if (isPlatformBrowser(this.platformId)) {
      this.bookElement.nativeElement.style.transform = "translateX(50%)";
      this.prevBtnElement.nativeElement.style.transform = "translateX(-180px)";
      this.nextBtnElement.nativeElement.style.transform = "translateX(180px)";
    }
  }

  closeBook(isAtBeginning: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      const translateX = isAtBeginning ? "0%" : "100%";
      this.bookElement.nativeElement.style.transform = `translateX(${translateX})`;
      this.prevBtnElement.nativeElement.style.transform = "translateX(0px)";
      this.nextBtnElement.nativeElement.style.transform = "translateX(0px)";
    }
  }

  goNextPage() {
    if (this.currentLocation < this.paginatedData.length) {
      switch (this.currentLocation) {
        case 1:
          this.openBook();
          break;
        case 3:
          this.closeBook(false);
          break;
        default:
          throw new Error("unknown state");
      }
      this.currentLocation++;
    }
  }

  goPrevPage() {
    if (this.currentLocation > 1) {
      switch (this.currentLocation) {
        case 2:
          this.closeBook(true);
          break;
        case 4:
          this.openBook();
          break;
        default:
          throw new Error("unknown state");
      }
      this.currentLocation--;
    }
  }
}