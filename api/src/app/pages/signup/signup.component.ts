  import { CommonModule } from '@angular/common';
  import { HttpClient, HttpClientModule } from '@angular/common/http';
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { AuthService } from '../../services/auth.service';
import { LoadingPageComponent } from '../../addons/loading-page/loading-page.component';

  @Component({
    selector: 'app-signup',
    standalone: true,
    imports: [FormsModule, HttpClientModule, CommonModule, LoadingPageComponent],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css'
  })

  export class SignupComponent {
    username: string = '';
    email: string = '';
    password: string = '';
    errorMessage: string = ''; 
    signupId: string = ''; 
    loading: boolean = false;

    readonly VALID_SIGNUP_ID: string = '@GCARCO';
    
    constructor(private authService: AuthService, private router: Router) {}

    onSignup() {
      if (!this.username || !this.email || !this.password || !this.signupId) {
        alert('Please fill in all fields');
        return;
      }

    if (this.signupId !== this.VALID_SIGNUP_ID) {
      alert('Invalid Signup ID');
      return;
    }

    this.loading = true;

      const data = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      this.authService.userSignUp(data).subscribe(
        (response: any) => {
          console.log(response.message);
          this.authService.setToken(response.jwt);
          this.router.navigate(['/login']);
          this.loading = false;
        },
        (error: any) => {
          if (error.status === 409) {
            alert('Email already exists.');
            this.loading = false;
          } else if (error.status === 400) {
            alert('Please provide all required fields.');
            this.loading = false;
          } else {
            alert('An unexpected error occurred. Please try again later.');
            this.loading = false;
          }
        }
      );
    }
  }