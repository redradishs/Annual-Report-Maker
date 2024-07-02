import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  isNotifOpen: boolean = false;
  openNotif() {
    this.isNotifOpen = true;
    console.log("Notif opened");
  }
  closeNotif() {
    this.isNotifOpen = false;
    console.log("Notif closed");
  }
}
