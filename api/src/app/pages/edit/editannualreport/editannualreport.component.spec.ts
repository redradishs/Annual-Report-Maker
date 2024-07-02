import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditannualreportComponent } from './editannualreport.component';

describe('EditannualreportComponent', () => {
  let component: EditannualreportComponent;
  let fixture: ComponentFixture<EditannualreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditannualreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditannualreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
