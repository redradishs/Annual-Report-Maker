import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcollageComponent } from './newcollage.component';

describe('NewcollageComponent', () => {
  let component: NewcollageComponent;
  let fixture: ComponentFixture<NewcollageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewcollageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewcollageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
