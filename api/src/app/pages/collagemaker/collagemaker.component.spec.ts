import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollagemakerComponent } from './collagemaker.component';

describe('CollagemakerComponent', () => {
  let component: CollagemakerComponent;
  let fixture: ComponentFixture<CollagemakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollagemakerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollagemakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
