import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VieweventreportComponent } from './vieweventreport.component';

describe('VieweventreportComponent', () => {
  let component: VieweventreportComponent;
  let fixture: ComponentFixture<VieweventreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VieweventreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VieweventreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
