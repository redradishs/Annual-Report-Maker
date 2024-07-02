import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotLoaderService {
  private renderer: Renderer2;


  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  
  loadScript(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.defer = true;
    script.setAttribute('chatbotId', 'bFHr9FOJQh-I-3DEPPZyZ');
    script.setAttribute('domain', 'www.chatbase.co');
    this.renderer.appendChild(document.head, script);
  }
  
}
