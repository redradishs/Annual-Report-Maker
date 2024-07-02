import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectreportoutputComponent } from './projectreportoutput.component';

describe('ProjectreportoutputComponent', () => {
  let component: ProjectreportoutputComponent;
  let fixture: ComponentFixture<ProjectreportoutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectreportoutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectreportoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
