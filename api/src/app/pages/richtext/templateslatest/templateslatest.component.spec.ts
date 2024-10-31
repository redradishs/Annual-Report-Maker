import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateslatestComponent } from './templateslatest.component';

describe('TemplateslatestComponent', () => {
  let component: TemplateslatestComponent;
  let fixture: ComponentFixture<TemplateslatestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateslatestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateslatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
