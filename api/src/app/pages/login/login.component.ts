import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { AuthService } from '../../services/auth.service';
import { LoadingPageComponent } from '../../addons/loading-page/loading-page.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, LoadingPageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 
  loading: boolean = false; 
  returnUrl: string = '/'; 

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  
  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    
    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.userLogin(data).subscribe(
      (response: any) => {
        console.log('Login Successful.', response);
        this.authService.setToken(response.jwt);
        this.router.navigateByUrl(this.returnUrl);
        this.loading = false;
      },
      (error: any) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }
}
