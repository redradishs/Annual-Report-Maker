import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ChatbotLoaderService } from '../../services/chatbot-loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import mammoth from 'mammoth';
import { Sapling } from '@saplingai/sapling-js/observer';
import { TableModalComponent } from '../richtext/table-modal/table-modal.component';
import interact from 'interactjs';



@Component({
  selector: 'app-newcollage',
  standalone: true,
  imports: [NavbarComponent, CommonModule, DragDropModule],
  templateUrl: './newcollage.component.html',
  styleUrl: './newcollage.component.css'
})
export class NewcollageComponent implements AfterViewInit {
  @ViewChild('textInput', { static: false }) textInput!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('resizeMenu', { static: false }) resizeMenu!: ElementRef<HTMLDivElement>;
  @ViewChild('tableControls', { static: false }) tableControls!: ElementRef;
  @ViewChild('collageContainer', { static: false }) collageContainer!: ElementRef<HTMLDivElement>;

  images: string[] = [];
  selectedTable: HTMLTableElement | null = null;
  currentImage: HTMLImageElement | null = null;
  isInsertingImageHeader = false;
  showFlexToolbar = false;
  isImageListVisible = false;
  userId = 2;

  selectedImages: any[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  zoomLevel: number = 1;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private api: ApiService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.route.params.subscribe(params => {
          this.fetchImages();
        });
      }
    });
  }

  // Add this method to zoom in
  zoomIn(): void {
    this.zoomLevel += 0.1;
    this.applyZoom();
  }

  // Add this method to zoom out
  zoomOut(): void {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
      this.applyZoom();
    }
  }

  // Method to apply the zoom level
  applyZoom(): void {
    if (this.collageContainer) {
      this.collageContainer.nativeElement.style.transform = `scale(${this.zoomLevel})`;
    }
  }

  ngAfterViewInit(): void {
    this.bindTextFormattingButtons();
    this.bindSelectOptions();
    this.bindAlignmentButtons();
    window.addEventListener('scroll', this.onWindowScroll.bind(this));
  }

  bindSelectOptions(): void {
    const fontSizeSelect = document.getElementById('fontSize') as HTMLSelectElement;
    if (fontSizeSelect) {
      for (let i = 1; i <= 7; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = i.toString();
        fontSizeSelect.appendChild(option);
      }
      fontSizeSelect.addEventListener('change', () => {
        const fontSize = fontSizeSelect.value;
        document.execCommand('fontSize', false, fontSize);
      });
    }
  
    const fontNameSelect = document.getElementById('fontName') as HTMLSelectElement;
    const fonts = ["Arial", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];
    if (fontNameSelect) {
      fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.innerHTML = font;
        fontNameSelect.appendChild(option);
      });
      fontNameSelect.addEventListener('change', () => {
        const fontName = fontNameSelect.value;
        document.execCommand('fontName', false, fontName);
      });
    }
  }

  bindAlignmentButtons(): void {
    const alignmentCommands = [
      { id: 'justifyLeft', command: 'justifyLeft' },
      { id: 'justifyCenter', command: 'justifyCenter' },
      { id: 'justifyRight', command: 'justifyRight' },
      { id: 'justifyFull', command: 'justifyFull' }
    ];
  
    alignmentCommands.forEach(item => {
      const button = document.getElementById(item.id);
      if (button) {
        button.addEventListener('click', () => {
          document.execCommand(item.command, false, '');
        });
      }
    });
  }

  bindTextFormattingButtons(): void {
    const formattingCommands = [
      { id: 'bold', command: 'bold' },
      { id: 'italic', command: 'italic' },
      { id: 'underline', command: 'underline' },
      { id: 'strikethrough', command: 'strikethrough' },
      { id: 'superscript', command: 'superscript' },
      { id: 'subscript', command: 'subscript' }
    ];
  
    formattingCommands.forEach(item => {
      const button = document.getElementById(item.id);
      if (button) {
        button.addEventListener('click', () => {
          document.execCommand(item.command, false, '');
        });
      }
    });
  }

  fetchImages(): void {
    this.api.fetchElements(this.userId!).subscribe(
      (response) => {
        this.images = response.data.map((item: any) => this.api.constructImageUrl(item.file_path));
      },
      (error) => console.error('Error fetching images:', error)
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.api.uploadElements(this.userId!, formData).subscribe(
        (response) => {
          if (response.success) {
            this.fetchImages();
          } else {
            alert('Image upload failed: ' + response.message);
          }
        },
        (error) => console.error('Error:', error)
      );
    }
  }

  toggleImageList(): void {
    const imageListContainer = document.getElementById('imageListContainer');
    const toolbarButtons = document.querySelectorAll('.toolbar .option-button, .toolbar .adv-option-button, .toolbar .input-wrapper');
    if (imageListContainer) {
      if (imageListContainer.style.display === 'none') {
        imageListContainer.style.display = 'block';
        toolbarButtons.forEach(button => (button as HTMLElement).classList.add('hidden'));
      } else {
        imageListContainer.style.display = 'none';
        toolbarButtons.forEach(button => (button as HTMLElement).classList.remove('hidden'));
      }
    }
  }
  
  closeImageList(): void {
    const imageListContainer = document.getElementById('imageListContainer');
    const toolbarButtons = document.querySelectorAll('.toolbar .option-button, .toolbar .adv-option-button, .toolbar .input-wrapper');
    if (imageListContainer) {
      imageListContainer.style.display = 'none';
      toolbarButtons.forEach(button => (button as HTMLElement).classList.remove('hidden'));
    }
  }
  
  insertImage(imageSrc: string): void {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.cursor = 'pointer';
    img.classList.add('resizable');
  
    this.textInput.nativeElement.appendChild(img);
  
    this.addImageClickListener(img);
    this.closeImageList();
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const toolbar = document.querySelector('.toolbar') as HTMLElement;
    if (toolbar) {
      if (window.scrollY > 50) {
        toolbar.style.top = '-100px'; // Hide toolbar
      } else {
        toolbar.style.top = '0'; // Show toolbar
      }
    }
  }

  changeCollageColor(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const color = inputElement.value;
    this.collageContainer.nativeElement.style.backgroundColor = color;
}

  
  
  insertTextHeader(): void {
    const headerText = prompt('Enter header text:');
    if (headerText) {
      const header = document.createElement('div');
      header.className = 'header';
      header.textContent = headerText;
      this.textInput.nativeElement.appendChild(header);
    }
  }

  toggleImageListForHeader(): void {
    const imageListContainer = document.getElementById('imageListContainer');
    if (imageListContainer) {
      imageListContainer.style.display = imageListContainer.style.display === 'none' ? 'block' : 'none';
      this.isInsertingImageHeader = true;
    }
  }

  openTableModal(): void {
    const dialogRef = this.dialog.open(TableModalComponent);

    dialogRef.componentInstance.tableCreated.subscribe((data: { rows: number, cols: number, headers: boolean, styleType: 'normal' | 'custom' }) => {
      this.insertTable(data.rows, data.cols, data.headers, data.styleType);
    });
  }

  insertTable(rows: number, cols: number, headers: boolean, styleType: 'normal' | 'custom'): void {
    let tableHtml = `<table class="table">`;

    if (headers) {
      tableHtml += `<thead><tr class="header">`;
      for (let j = 0; j < cols; j++) {
        tableHtml += `<th contenteditable="true">Header</th>`;
      }
      tableHtml += `</tr></thead>`;
    }

    tableHtml += `<tbody>`;
    for (let i = 0; i < rows; i++) {
      tableHtml += `<tr>`;
      for (let j = 0; j < cols; j++) {
        tableHtml += `<td contenteditable="true">Cell</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table>`;

    const div = document.createElement('div');
    div.innerHTML = tableHtml;
    this.textInput.nativeElement.appendChild(div);
  }

  resizeImage(percentage: number): void {
    if (this.currentImage) {
      this.currentImage.style.width = `${percentage}%`;
    }
  }

  alignImage(alignment: string): void {
    if (this.currentImage) {
      this.currentImage.style.display = 'block';
      this.currentImage.style.marginLeft = alignment === 'center' ? 'auto' : '0';
      this.currentImage.style.marginRight = alignment === 'center' ? 'auto' : '0';
      this.currentImage.style.float = alignment === 'left' || alignment === 'right' ? alignment : 'none';
    }
  }

  setBorderRadius(radius: number): void {
    if (this.currentImage) {
      this.currentImage.style.borderRadius = `${radius}px`;
    }
  }

  applyFlexProperty(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const property = selectElement.value;
    if (!property) return;

    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      const selectedContent = range.extractContents();
      const span = document.createElement('span');
      span.style.display = 'flex';
      span.style.justifyContent = property;
      span.style.width = '100%';
      span.appendChild(selectedContent);
      range.insertNode(span);
    }
    selectElement.value = '';
  }

  addRow(): void {
    if (this.selectedTable) {
      const newRow = this.selectedTable.insertRow();
      const cols = this.selectedTable.rows[0].cells.length;
      for (let i = 0; i < cols; i++) {
        const newCell = newRow.insertCell();
        newCell.contentEditable = 'true';
        newCell.innerHTML = 'Cell';
      }
    }
  }

  addColumn(): void {
    if (this.selectedTable) {
      const rows = this.selectedTable.rows;
      for (let i = 0; i < rows.length; i++) {
        const newCell = rows[i].insertCell();
        newCell.contentEditable = 'true';
        newCell.innerHTML = 'Cell';
      }
    }
  }

private addImageClickListener(img: HTMLImageElement): void {
    img.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.showResizeMenu(event, img);
    });
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
    if (
        this.resizeMenu &&
        !this.resizeMenu.nativeElement.contains(event.target as Node) &&
        (!this.currentImage || !this.currentImage.contains(event.target as Node))
    ) {
        this.hideResizeMenu();
    }
}

  setSpacing(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const spacing = selectElement.value;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedContent = range.extractContents();
      const div = document.createElement('div');
      div.style.lineHeight = spacing;
      div.appendChild(selectedContent);
      range.insertNode(div);
      range.selectNodeContents(div);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  private showResizeMenu(event: MouseEvent, img: HTMLImageElement): void {
    if (this.resizeMenu) {
        this.currentImage = img;
        this.resizeMenu.nativeElement.style.display = 'block';
        this.resizeMenu.nativeElement.style.left = `${event.pageX}px`;
        this.resizeMenu.nativeElement.style.top = `${event.pageY}px`;
    }
}

private hideResizeMenu(): void {
  if (this.resizeMenu) {
      this.resizeMenu.nativeElement.style.display = 'none';
      this.currentImage = null;
  }
}


  handleFlexToolbar(event: MouseEvent) {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        this.showFlexToolbar = true;
        const flexToolbar = document.getElementById("flex-toolbar");
        if (flexToolbar) {
          flexToolbar.style.left = `${rect.left + window.scrollX}px`;
          flexToolbar.style.top = `${rect.bottom + window.scrollY}px`;
        }
      }
    } else {
      this.showFlexToolbar = false;
    }
  }

  saveContent(): void {
    if (this.textInput && this.textInput.nativeElement) {
      if (this.userId !== null) {
        const content = this.textInput.nativeElement.innerHTML;
        const url = this.api.getSaveContentUrl(this.userId);
        const body = { content };
  
        this.api.saveContent(url, body).subscribe(response => {
          console.log('Content saved:', response);
          this.router.navigate(['document/view']);
        }, error => {
          console.error('Error saving content:', error);
        });
      } else {
        console.error('User ID is null');
      }
    } else {
      console.error('textInput is not initialized');
    }
  }

  changeFontFamily(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const fontFamily = selectElement.value;
    document.execCommand('fontName', false, fontFamily);
  }

  changeFontSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const fontSize = selectElement.value;
    document.execCommand('fontSize', false, '7');
    const fontElements = document.getElementsByTagName('font');
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].size === '7') {
        fontElements[i].removeAttribute('size');
        fontElements[i].style.fontSize = fontSize;
      }
    }
  }

  applyHeading(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const headingTag = selectElement.value;
    if (headingTag) {
      document.execCommand('formatBlock', false, headingTag);
    }
  }

  eraseText(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      if (startContainer !== endContainer) {
        const commonAncestor = range.commonAncestorContainer as HTMLElement;
        const walker = document.createTreeWalker(commonAncestor, NodeFilter.SHOW_ELEMENT, null);
        let node = walker.currentNode as HTMLElement;

        while (node) {
          if (selection.containsNode(node, true) && node !== this.textInput.nativeElement) {
            node.removeAttribute('style');
            node.className = '';
          }
          node = walker.nextNode() as HTMLElement;
        }
      } else {
        let parentElement = startContainer.parentElement;
        while (parentElement && parentElement !== this.textInput.nativeElement) {
          parentElement.removeAttribute('style');
          parentElement.className = '';
          parentElement = parentElement.parentElement;
        }

        let commonAncestor = range.commonAncestorContainer;
        if (commonAncestor.nodeType !== Node.ELEMENT_NODE) {
          commonAncestor = commonAncestor.parentElement as HTMLElement;
        } else {
          commonAncestor = commonAncestor as HTMLElement;
        }

        const children = (commonAncestor as Element).querySelectorAll('*');
        children.forEach(child => {
          if (child !== this.textInput.nativeElement) {
            (child as HTMLElement).removeAttribute('style');
            (child as HTMLElement).className = '';
          }
        });

        const span = document.createElement('span');
        span.style.fontFamily = 'Arial';
        span.style.fontSize = '16px';
        span.style.color = 'black';
        span.innerHTML = range.toString();
        range.deleteContents();
        range.insertNode(span);
      }
    }
  }
}