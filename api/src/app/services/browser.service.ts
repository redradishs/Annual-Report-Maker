import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BrowserService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get window(): Window | undefined {
    if (this.isBrowser) {
      return window;
    }
    return undefined;
  }

  get document(): Document | undefined {
    if (this.isBrowser) {
      return document;
    }
    return undefined;
  }

  get localStorage(): Storage | undefined {
    if (this.isBrowser) {
      return localStorage;
    }
    return undefined;
  }
}
