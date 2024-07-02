import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeventreportComponent } from './editeventreport.component';

describe('EditeventreportComponent', () => {
  let component: EditeventreportComponent;
  let fixture: ComponentFixture<EditeventreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeventreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditeventreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
