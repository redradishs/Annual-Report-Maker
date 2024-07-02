import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfinancialrepertComponent } from './viewfinancialrepert.component';

describe('ViewfinancialrepertComponent', () => {
  let component: ViewfinancialrepertComponent;
  let fixture: ComponentFixture<ViewfinancialrepertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewfinancialrepertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewfinancialrepertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
