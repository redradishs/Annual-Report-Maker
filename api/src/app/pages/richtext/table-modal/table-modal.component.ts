import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule
  ],
  templateUrl: './table-modal.component.html',
  styleUrls: ['./table-modal.component.css']
})
export class TableModalComponent {
  rows: number = 2;
  cols: number = 2;
  headers: boolean = false;
  styleType: string = 'normal';

  @Output() tableCreated = new EventEmitter<{ rows: number, cols: number, headers: boolean, styleType: string }>();

  constructor(public dialogRef: MatDialogRef<TableModalComponent>) {}

  createTable() {
    console.log('Creating table with:', { rows: this.rows, cols: this.cols, headers: this.headers, styleType: this.styleType });
    this.tableCreated.emit({ rows: this.rows, cols: this.cols, headers: this.headers, styleType: this.styleType });
    this.dialogRef.close();
  }
}
