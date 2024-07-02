import { TestBed } from '@angular/core/testing';

import { ChatbotLoaderService } from './chatbot-loader.service';

describe('ChatbotLoaderService', () => {
  let service: ChatbotLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
