import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialreportComponent } from './financialreport.component';

describe('FinancialreportComponent', () => {
  let component: FinancialreportComponent;
  let fixture: ComponentFixture<FinancialreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
