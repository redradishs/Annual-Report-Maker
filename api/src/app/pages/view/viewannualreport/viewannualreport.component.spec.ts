import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewannualreportComponent } from './viewannualreport.component';

describe('ViewannualreportComponent', () => {
  let component: ViewannualreportComponent;
  let fixture: ComponentFixture<ViewannualreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewannualreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewannualreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
