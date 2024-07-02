import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialreportoutputComponent } from './financialreportoutput.component';

describe('FinancialreportoutputComponent', () => {
  let component: FinancialreportoutputComponent;
  let fixture: ComponentFixture<FinancialreportoutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialreportoutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialreportoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
