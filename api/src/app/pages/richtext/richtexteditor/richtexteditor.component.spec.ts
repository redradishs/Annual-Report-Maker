import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtexteditorComponent } from './richtexteditor.component';

describe('RichtexteditorComponent', () => {
  let component: RichtexteditorComponent;
  let fixture: ComponentFixture<RichtexteditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichtexteditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RichtexteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
