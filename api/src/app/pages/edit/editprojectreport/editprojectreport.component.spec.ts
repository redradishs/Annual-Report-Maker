import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprojectreportComponent } from './editprojectreport.component';

describe('EditprojectreportComponent', () => {
  let component: EditprojectreportComponent;
  let fixture: ComponentFixture<EditprojectreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditprojectreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditprojectreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
