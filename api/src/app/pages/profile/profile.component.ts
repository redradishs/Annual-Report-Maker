import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { BackComponent } from '../../addons/back/back.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, RouterLink, RouterOutlet, RouterModule, FormsModule, ReactiveFormsModule, CommonModule, BackComponent],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  currentPasswordError: string = '';
  newPasswordError: string = '';

  userId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.retrieveProfileData();
      } else {
        console.log('No user logged in.');
      }
    });
  }

  clearPasswordFields() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  retrieveProfileData() {
    this.apiService.retrieveProfileData(this.userId!).subscribe(
      (resp: any) => {
        console.log('Profile data:', resp);
        if (resp.data && resp.data.length > 0) {
          this.profileData = resp.data[0];  // Access the first element of the array
        } else {
          console.error('No data available');
        }
      },
      (error) => {
        console.error('Error retrieving profile data', error);
      }
    );
  }

  validatePasswords() {
    this.currentPasswordError = '';
    this.newPasswordError = '';

    if (this.userId !== null) {
      this.apiService.validatePassword(this.userId, this.currentPassword).subscribe(
        (resp: any) => {
          if (resp.status.remarks !== 'success') {
            this.currentPasswordError = 'Current password is incorrect.';
          } else if (this.newPassword !== this.confirmNewPassword) {
            this.newPasswordError = 'New passwords do not match.';
          } else {
            this.updatePassword();
          }
        },
        (error) => {
          this.currentPasswordError = 'Error validating current password.';
          console.error('Error validating password:', error);
        }
      );
    } else {
      console.error('User ID is not set.');
    }
  }


updateUsernameAndEmail() {
  const data = {
    username: this.profileData.username,
    email: this.profileData.email
  };

 this.apiService.updateProfile(this.userId!, data).subscribe(
    (resp: any) => {
      console.log('Profile updated successfully');
    },
    (error) => {
      console.error('Error updating profile', error);
    }
  );
}

updatePassword() {
  if (this.userId !== null) {
    if (this.newPassword !== this.confirmNewPassword) {
      this.newPasswordError = 'New passwords do not match.';
      return;
    }

    this.apiService.validatePassword(this.userId, this.currentPassword).subscribe(
      (resp: any) => {
        if (resp.status.remarks !== 'success') {
          this.currentPasswordError = 'Current password is incorrect.';
        } else {
          const data = { password: this.newPassword };
          this.apiService.updateProfile(this.userId!, data).subscribe(
            (response: any) => {
              console.log('Password updated successfully');
              this.clearPasswordFields();
            },
            (error) => {
              console.error('Error updating password', error);
            }
          );
        }
      },
      (error) => {
        this.currentPasswordError = 'Error validating current password.';
        console.error('Error validating password:', error);
      }
    );
  } else {
    console.error('User ID is not set.');
  }
}


logout(): void {
  this.authService.logout();
}
}