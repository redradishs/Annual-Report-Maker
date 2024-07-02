import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtextviewgeneralComponent } from './richtextviewgeneral.component';

describe('RichtextviewgeneralComponent', () => {
  let component: RichtextviewgeneralComponent;
  let fixture: ComponentFixture<RichtextviewgeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichtextviewgeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RichtextviewgeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
