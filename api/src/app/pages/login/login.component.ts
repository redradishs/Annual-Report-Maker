import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingPageComponent } from '../../addons/loading-page/loading-page.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, LoadingPageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // To store error message
  loading: boolean = false; 
  
  constructor(private authService: AuthService, private router: Router) {}
  
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
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      (error: any) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }
}