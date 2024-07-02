import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtextviewComponent } from './richtextview.component';

describe('RichtextviewComponent', () => {
  let component: RichtextviewComponent;
  let fixture: ComponentFixture<RichtextviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichtextviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RichtextviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
