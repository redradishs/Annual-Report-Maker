import { Component } from '@angular/core';
import { NavbarComponent } from '../../pages/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notfoundpage',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './notfoundpage.component.html',
  styleUrl: './notfoundpage.component.css'
})
export class NotfoundpageComponent {

}
