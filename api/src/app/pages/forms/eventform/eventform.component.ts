import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-eventform',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './eventform.component.html',
  styleUrl: './eventform.component.css'
})
export class EventformComponent implements OnInit {
    userId: number | null = null;
    eventForm: FormGroup;
  
    constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private authService: AuthService, private apiService: ApiService) {
      this.eventForm = this.fb.group({
        event_name: ['', Validators.required],
        event_date: ['', Validators.required],
        event_title: ['', Validators.required],
        address: ['', Validators.required],
        expected_participants: ['', Validators.required],
        total_participants: ['', Validators.required],
        items: this.fb.array([]),
        summary: ['', Validators.required]
      });
    }
  
    ngOnInit(): void {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          this.userId = user.id;
          console.log('User ID:', this.userId);
        } else {
          console.log('No user logged in.');
        }
      });
  
      this.addItem();
    }
  
    get items(): FormArray {
      return this.eventForm.get('items') as FormArray;
    }
  
    addItem(): void {
      this.items.push(this.fb.group({
        item: ['', Validators.required],
        amount: ['', Validators.required]
      }));
    }
  
    removeItem(index: number): void {
      this.items.removeAt(index);
    }
  
    submitAndNavigate() {
      if (this.eventForm.valid) {
        const eventData = {
          event_name: this.eventForm.value.event_name,
          event_date: this.eventForm.value.event_date,
          event_title: this.eventForm.value.event_title,
          address: this.eventForm.value.address,
          expected_participants: this.eventForm.value.expected_participants,
          total_participants: this.eventForm.value.total_participants,
          summary: this.eventForm.value.summary,
          user_id: this.userId
        };
  
        this.apiService.submitEventReport(this.userId!, eventData)
          .subscribe(
            (resp: any) => {
              console.log('Event report submitted:', resp);
              const eventId = resp.event_id;
              this.submitEventExpenses(eventId);
            },
            (error) => {
              console.error('Error Submitting Event Report', error);
            }
          );
      } else {
        console.warn('Form is not valid. Check required fields.');
      }
    }
  
    mapExpenses(expenses: any[]): any {
      const expenseData: any = {};
      for (let i = 0; i < 10; i++) {
        expenseData[`expense_item${i + 1}`] = expenses[i]?.item || '';
        expenseData[`expense_amount${i + 1}`] = expenses[i]?.amount || '';
      }
      return expenseData;
    }
  
    submitEventExpenses(eventId: number) {
      const expensesData = this.mapExpenses(this.items.controls.map(control => control.value));
  
  
      this.apiService.submitEventExpenses(this.userId!, {event_id: eventId, ...expensesData})
        .subscribe(
          (resp) => {
            console.log('Event expenses submitted:', resp);
            this.router.navigate(['create/eventreport/uploadmedia']);
          },
          (error) => {
            console.error('Error Submitting Event Expenses', error);
          }
        );
    }
  }