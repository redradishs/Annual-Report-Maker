import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class HhtmlsplitterService {
  constructor(private sanitizer: DomSanitizer) { }

  splitHtmlContent(html: string, charactersPerPage: number): SafeHtml[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    const pages: string[] = [];
    let currentPage = '';
    let currentLength = 0;

    function traverseNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || '';
        const remainingLength = charactersPerPage - currentLength;

        if (textContent.length > remainingLength) {
          const splitIndex = remainingLength;
          currentPage += textContent.substring(0, splitIndex);
          pages.push(currentPage);
          currentPage = textContent.substring(splitIndex);
          currentLength = currentPage.length;
        } else {
          currentPage += textContent;
          currentLength += textContent.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagOpen = `<${element.tagName.toLowerCase()}${Array.from(element.attributes).map(attr => ` ${attr.name}="${attr.value}"`).join('')}>`;
        const tagClose = `</${element.tagName.toLowerCase()}>`;

        if (element.tagName.toLowerCase() === 'table' || element.tagName.toLowerCase() === 'img') {
          // Ensure tables and images are not split across pages
          const elementHtml = element.outerHTML;
          if (currentLength + elementHtml.length > charactersPerPage) {
            pages.push(currentPage);
            currentPage = '';
            currentLength = 0;
          }
          currentPage += elementHtml;
          currentLength += elementHtml.length;
        } else {
          currentPage += tagOpen;
          Array.from(node.childNodes).forEach(traverseNodes);
          currentPage += tagClose;
        }
      }
    }

    Array.from(body.childNodes).forEach(traverseNodes);

    if (currentPage) {
      pages.push(currentPage);
    }

    return pages.map(page => this.sanitizer.bypassSecurityTrustHtml(page));
  }
}
