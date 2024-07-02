import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfinancialreportComponent } from './editfinancialreport.component';

describe('EditfinancialreportComponent', () => {
  let component: EditfinancialreportComponent;
  let fixture: ComponentFixture<EditfinancialreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditfinancialreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditfinancialreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
