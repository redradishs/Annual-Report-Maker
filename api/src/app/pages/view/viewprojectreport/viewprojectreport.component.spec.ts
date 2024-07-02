import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewprojectreportComponent } from './viewprojectreport.component';

describe('ViewprojectreportComponent', () => {
  let component: ViewprojectreportComponent;
  let fixture: ComponentFixture<ViewprojectreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewprojectreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewprojectreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
