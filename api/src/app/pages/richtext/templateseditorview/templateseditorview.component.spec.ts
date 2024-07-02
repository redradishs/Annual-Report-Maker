import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateseditorviewComponent } from './templateseditorview.component';

describe('TemplateseditorviewComponent', () => {
  let component: TemplateseditorviewComponent;
  let fixture: ComponentFixture<TemplateseditorviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateseditorviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateseditorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
