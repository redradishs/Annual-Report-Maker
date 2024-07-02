import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateseditorComponent } from './templateseditor.component';

describe('TemplateseditorComponent', () => {
  let component: TemplateseditorComponent;
  let fixture: ComponentFixture<TemplateseditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateseditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateseditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
