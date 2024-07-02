import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReportStatusComponent } from './projectreportstatus.component';

describe('ProjectreportstatusComponent', () => {
  let component: ProjectReportStatusComponent;
  let fixture: ComponentFixture<ProjectReportStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectReportStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
