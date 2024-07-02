import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichtextcollabeditComponent } from './richtextcollabedit.component';

describe('RichtextcollabeditComponent', () => {
  let component: RichtextcollabeditComponent;
  let fixture: ComponentFixture<RichtextcollabeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichtextcollabeditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RichtextcollabeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
