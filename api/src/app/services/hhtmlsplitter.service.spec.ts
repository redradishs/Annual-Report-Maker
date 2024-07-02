import { TestBed } from '@angular/core/testing';

import { HhtmlsplitterService } from './hhtmlsplitter.service';

describe('HhtmlsplitterService', () => {
  let service: HhtmlsplitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HhtmlsplitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
