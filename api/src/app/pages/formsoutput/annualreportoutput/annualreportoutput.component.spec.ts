import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualreportoutputComponent } from './annualreportoutput.component';

describe('AnnualreportoutputComponent', () => {
  let component: AnnualreportoutputComponent;
  let fixture: ComponentFixture<AnnualreportoutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnualreportoutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnualreportoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
