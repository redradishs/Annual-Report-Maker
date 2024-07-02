import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventreportoutputComponent } from './eventreportoutput.component';

describe('EventreportoutputComponent', () => {
  let component: EventreportoutputComponent;
  let fixture: ComponentFixture<EventreportoutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventreportoutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventreportoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
