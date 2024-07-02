import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateseditorblankComponent } from './templateseditorblank.component';

describe('TemplateseditorblankComponent', () => {
  let component: TemplateseditorblankComponent;
  let fixture: ComponentFixture<TemplateseditorblankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateseditorblankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateseditorblankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
