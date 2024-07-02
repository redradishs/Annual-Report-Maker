import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtexteditComponent } from './richtextedit.component';

describe('RichtexteditComponent', () => {
  let component: RichtexteditComponent;
  let fixture: ComponentFixture<RichtexteditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichtexteditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RichtexteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
