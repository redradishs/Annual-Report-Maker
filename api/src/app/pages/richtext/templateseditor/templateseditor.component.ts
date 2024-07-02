import { Component, ElementRef, HostListener, ViewChild, viewChild } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatbotLoaderService } from '../../../services/chatbot-loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import mammoth from 'mammoth';
import { Sapling } from '@saplingai/sapling-js/observer';
import { TableModalComponent } from '../table-modal/table-modal.component';
import interact from 'interactjs';
import { FormsModule, NgModel } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-templateseditor',
  standalone: true,
  imports: [NavbarComponent, CommonModule, PaginationComponent],
  templateUrl: './templateseditor.component.html',
  styleUrl: './templateseditor.component.css'
})
export class TemplateseditorComponent {
  @ViewChild('textInput', { static: false }) textInput!: ElementRef<HTMLDivElement>;
  @ViewChild('imageUpload', { static: false }) imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('resizeMenu', { static: false }) resizeMenu!: ElementRef<HTMLDivElement>;
  @ViewChild('textFormatMenu', { static: false }) textFormatMenu!: ElementRef<HTMLDivElement>;
  @ViewChild('tableControls', { static: false }) tableControls!: ElementRef;
  @ViewChild('wordInput', { static: true }) wordInput!: ElementRef;

  private selectedTable: HTMLTableElement | null = null;  
  saplingEnabled: boolean = false;

  title: string | null = null;

  showFlexToolbar = false;
  toolbarLeft: number | null = null;
  toolbarTop: number | null = null;
  userId: number | null = null;

  postId: number | null = null;
  documentContent: string = '';

  images: string[] = [];
  selectedImage: HTMLImageElement | null = null;

  private uploadUrl: string = '';
  private fetchUrl: string = '';

  fontList: string[] = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Georgia",
    "Courier New",
    "cursive",
  ];

  currentImage: HTMLImageElement | null = null;
  isInsertingImageHeader = false; 

  constructor(private http: HttpClient, 
    private authService: AuthService, 
    private router: Router, 
    private chatbotloader: ChatbotLoaderService,
    private route: ActivatedRoute,
    private diaglog: MatDialog,
    private api: ApiService
  ) {

  }



  ngOnInit(): void {
    this.chatbotloader.loadScript(); 

    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User ID:', this.userId);
        this.route.params.subscribe(params => {
          this.postId = params['id'];
          this.fetchDocument();
        });
        this.fetchImages();
        console.log('Post ID:', this.postId);
      } else {
        console.log('No user logged in.');
      }
    });
  }

  //spacing starts here
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
  
  

  //spacing ends here

  //word input starts here

  importWord(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const options = {
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "table => table.table-bordered",
            "b => strong",
            "i => em",
            "u => u",
            "strike => s",
            "p[style-name='Normal'] => p:fresh",
            "r[style-name='Strong'] => strong",
            "r[style-name='Emphasis'] => em"
          ],
          transformDocument: this.transformParagraph
        };
  
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, options)
          .then((result) => {
            let html = result.value; // The generated HTML
            html = this.addTableBorders(html); // Add table borders
            html = this.addInlineStyles(html); // Add inline styles
            this.insertHtmlToEditor(html);
          })
          .catch((err) => {
            console.error('Error converting Word document:', err);
          });
      };
  
      reader.readAsArrayBuffer(file);
    }
  }
  

  addInlineStyles(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
  
    const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, table, th, td');
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(element);
        element.style.fontFamily = computedStyle.fontFamily;
        element.style.fontSize = computedStyle.fontSize;
        element.style.fontWeight = computedStyle.fontWeight;
        element.style.fontStyle = computedStyle.fontStyle;
        element.style.textAlign = computedStyle.textAlign;
        element.style.color = computedStyle.color;
      }
    });
  
    return tempDiv.innerHTML;
  }
  
  
  
  addTableBorders(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
  
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach(table => {
      if (table instanceof HTMLElement) {
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
  
        const thsAndTds = table.querySelectorAll('th, td');
        thsAndTds.forEach(cell => {
          if (cell instanceof HTMLElement) {
            cell.style.border = '1px solid #ddd';
            cell.style.textAlign = 'center';
            cell.style.verticalAlign = 'middle';
          }
        });
  
        const ths = table.querySelectorAll('th');
        ths.forEach(th => {
          if (th instanceof HTMLElement) {
            th.style.backgroundColor = '#f2f2f2';
            th.style.color = 'black';
          }
        });
      }
    });
  
    return tempDiv.innerHTML;
  }
  
  
  
  
// Function to transform paragraphs
transformParagraph(element: any) {
  if (element.alignment === "center" && !element.styleId) {
    return { ...element, styleId: "Heading2" };
  } else {
    return element;
  }
}


  
insertHtmlToEditor(html: string): void {
  this.textInput.nativeElement.innerHTML = html;
}

    //word input ends here
  


    fetchDocument(): void {
      if (this.userId && this.postId) {
        this.api.FetchTemplateRTE(this.postId).subscribe(
          response => {
            this.documentContent = response.data.content;
            this.title = response.data.title;
            this.textInput.nativeElement.innerHTML = this.documentContent;
            console.log('Document fetched:', response);
            console.log("The title is:", this.title);
          },
          error => {
            console.error('Error fetching document:', error);
          }
        );
      }
    }
    

    saveContent(): void {
      if (this.textInput && this.textInput.nativeElement) {
        if (this.userId !== null) {
          const content = this.textInput.nativeElement.innerHTML;
          const title = this.title;
          const isTemplate = "yes";
          const template_id = this.postId;
          const url = this.api.getTemplateURl(this.userId);
          const body = { content, title, isTemplate, template_id };
    
          this.api.saveUsedTemplate(url, body).subscribe(response => {
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
    
    



  ngAfterViewInit(): void {
    this.initializer();
    if (this.saplingEnabled) {
      this.initializeSapling();
    }
    document.addEventListener('click', this.handleClickOutside.bind(this));
    this.textInput.nativeElement.addEventListener('mouseup', this.handleTextSelection.bind(this));

    this.addTableContextMenuListeners();
  }

  //ADD ROW COL TO THE TABLE
  addTableContextMenuListeners(): void {
    this.textInput.nativeElement.addEventListener('contextmenu', (event) => {
      event.preventDefault(); 
      const target = event.target as HTMLElement;
      const table = this.findParentTable(target);
      if (table) {
        this.selectedTable = table;
        this.showTableControls(event);
      } else {
        this.hideTableControls();
      }
    });
  }
  
  

  showTableControls(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const table = this.findParentTable(target);
    if (table) {
      const rect = table.getBoundingClientRect();
      this.tableControls.nativeElement.style.display = 'flex';
      this.tableControls.nativeElement.style.left = `${rect.left + rect.width / 2}px`;
      this.tableControls.nativeElement.style.top = `${rect.bottom + window.scrollY}px`;
      this.tableControls.nativeElement.style.transform = 'translateX(-50%)';
    }
  }
  
  @HostListener('document:click', ['$event'])
handleDocumentClick(event: MouseEvent): void {
  if (this.tableControls && !this.tableControls.nativeElement.contains(event.target)) {
    this.hideTableControls();
  }
}

  
  
  

  hideTableControls(): void {
    this.tableControls.nativeElement.style.display = 'none';
  }

  addRow(): void {
    if (this.selectedTable) {
      const newRow = this.selectedTable.insertRow();
      const cols = this.selectedTable.rows[0].cells.length;
      for (let i = 0; i < cols; i++) {
        const newCell = newRow.insertCell();
        newCell.contentEditable = 'true';
        newCell.innerHTML = 'a';
        this.applyCellStyles(newCell);
      }
    }
  }
  
  addColumn(): void {
    if (this.selectedTable) {
      const headerRow = this.selectedTable.querySelector('thead tr') as HTMLTableRowElement;
      if (headerRow) {
        const newHeaderCell = headerRow.insertCell();
        newHeaderCell.contentEditable = 'true';
        newHeaderCell.innerHTML = 'a';
        this.applyHeaderCellStyles(newHeaderCell);
      }
  
      const bodyRows = this.selectedTable.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
      bodyRows.forEach(row => {
        const newCell = row.insertCell();
        newCell.contentEditable = 'true';
        newCell.innerHTML = 'a';
        this.applyCellStyles(newCell);
      });
    }
  }
  
  private applyHeaderCellStyles(cell: HTMLTableCellElement): void {
    cell.style.border = '1px solid #ddd';
    cell.style.textAlign = 'center';
    cell.style.verticalAlign = 'middle';
    cell.style.backgroundColor = '#f2f2f2';
    cell.style.color = 'black';
    cell.style.fontWeight = 'bold'
  }
  
  private applyCellStyles(cell: HTMLTableCellElement): void {
    cell.style.border = '1px solid #ddd';
    cell.style.textAlign = 'center';
    cell.style.verticalAlign = 'middle';
    cell.classList.add('plan'); 
  }
  
  
  


  private findParentTable(node: Node): HTMLTableElement | null {
    while (node && node.nodeName !== 'TABLE') {
      node = node.parentNode as Node;
    }
    return node as HTMLTableElement;
  }

  //END OF ADD ROW AND COL

  initializeSapling(): void {
    if (!this.saplingEnabled) {
      console.log('Sapling is disabled.');
      return;
    }
  
    try {
      Sapling.init({
        key: 'JONZMSE7ZAKE9KJDTHPSIW84NVILCKVI', 
        endpointHostname: 'https://api.sapling.ai',
        editPathname: '/api/v1/edits',
        statusBadge: true,
        mode: 'dev', 
      });
  
      const editor = this.textInput.nativeElement;
      Sapling.observe(editor);
    } catch (error) {
      console.error('Error initializing Sapling:', error);
    }
  }

  removeSaplingObserver(): void {
    const editor = this.textInput.nativeElement;
    Sapling.unobserve(editor);
  }
  

  toggleSapling(): void {
    this.saplingEnabled = !this.saplingEnabled;
    if (this.saplingEnabled) {
      this.initializeSapling();
    } else {
      this.removeSaplingObserver();
      console.log('Sapling has been turned off.');
    }
  }

  async autocomplete(text: string): Promise<void> {
    try {
      const response = await this.http.post('https://api.sapling.ai/api/v1/complete', {
        key: 'JONZMSE7ZAKE9KJDTHPSIW84NVILCKVI', 
        text,
        session_id: 'autocomplete-session'
      }).toPromise();
      console.log('Autocomplete Response:', response);
    } catch (error) {
      console.error('Error with autocomplete:', error);
    }
  }

  async analyzeTone(text: string): Promise<void> {
    try {
      const response = await this.http.post('https://api.sapling.ai/api/v1/tone', {
        key: 'JONZMSE7ZAKE9KJDTHPSIW84NVILCKVI', 
        text,
        session_id: 'tone-session'
      }).toPromise();
      console.log('Tone Analysis Response:', response);
    } catch (error) {
      console.error('Error with tone analysis:', error);
    }
  }

  async rephrase(text: string): Promise<void> {
    try {
      const response = await this.http.post('https://api.sapling.ai/api/v1/rephrase', {
        key: 'JONZMSE7ZAKE9KJDTHPSIW84NVILCKVI', 
        text,
        session_id: 'rephrase-session'
      }).toPromise();
      console.log('Rephrase Response:', response);
    } catch (error) {
      console.error('Error with rephrase:', error);
    }
  }

  async detectAIContent(text: string): Promise<void> {
    try {
      const response = await this.http.post('https://api.sapling.ai/api/v1/detect', {
        key: 'JONZMSE7ZAKE9KJDTHPSIW84NVILCKVI', 
        text,
        session_id: 'detect-session'
      }).toPromise();
      console.log('AI Content Detection Response:', response);
    } catch (error) {
      console.error('Error with AI content detection:', error);
    }
  }


  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.resizeMenu && this.resizeMenu.nativeElement && this.currentImage) {
      if (!this.resizeMenu.nativeElement.contains(target) && target !== this.currentImage) {
        this.resizeMenu.nativeElement.style.display = 'none';
        this.currentImage = null;
      }
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
  
  changeFontFamily(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const fontFamily = selectElement.value;
    document.execCommand('fontName', false, fontFamily);
  }

  //table starts here


  openTableModal(): void {
    const dialogRef = this.diaglog.open(TableModalComponent);

    dialogRef.componentInstance.tableCreated.subscribe((data: { rows: number, cols: number, headers: boolean, styleType: 'normal' | 'custom' }) => {
      console.log('Table data received:', data);
      this.insertTable(data.rows, data.cols, data.headers, data.styleType);
    });
  }
  insertTable(rows: number, cols: number, headers: boolean, styleType: 'normal' | 'custom'): void {
    console.log('Inserting table with:', { rows, cols, headers, styleType });
  
 
    const styleContent = `
      <style>
        .table {
          width: auto;
          min-width: 50%;
          max-width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          text-align: center;
          vertical-align: middle;
        }
        .table th {
          background-color: #f2f2f2;
          color: black;
        }
        .header {
          background-color: #4CAF50;
          color: white;
        }
        .plan {
          background-color: #f9f9f9;
        }
        .button {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
        }
      </style>
    `;
  

    let tableHtml = `<table class="table">`;
  
    if (headers) {
      tableHtml += `<thead><tr class="header">`;
      for (let j = 0; j < cols; j++) {
        tableHtml += `<th contenteditable="true">a</th>`;
      }
      tableHtml += `</tr></thead>`;
    }
  
    tableHtml += `<tbody>`;
    for (let i = 0; i < rows; i++) {
      tableHtml += `<tr class="plan">`;
      for (let j = 0; j < cols; j++) {
        tableHtml += `<td contenteditable="true">a</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table>`;
  

    const combinedHtml = styleContent + tableHtml;
  

    this.textInput.nativeElement.focus();
    console.log('Focused on textInput container');
  
   
    const textInputElement = this.textInput.nativeElement;
    const div = document.createElement('div');
    div.innerHTML = combinedHtml;
    textInputElement.appendChild(document.createElement('br')); 
    textInputElement.appendChild(div);
    console.log('Table appended to textInput');
  
 
    const range = document.createRange();
    range.setStartAfter(div);
    range.setEndAfter(div);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  
  //table ends here

  


  // image starts here
  fetchImages(): void {
    if (this.userId !== null) {
      this.api.fetchElements(this.userId).subscribe(
        (response) => {
          console.log('Fetch Images Response:', response); 
          if (response.data && Array.isArray(response.data)) {
            this.images = response.data.map((item: any) => {
              return this.api.constructImageUrl(item.file_path);
            });
          } else {
            console.error('Expected an array of images, but got:', response);
          }
        },
        (error) => {
          console.error('Error fetching images:', error);
        }
      );
    } else {
      console.error('User ID is not set.');
    }
  }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      if (this.userId !== null) {
        this.api.uploadElements(this.userId, formData).subscribe(
          (response) => {
            if (response.success) {
              this.fetchImages();
            } else {
              alert('Image upload failed: ' + response.message);
            }
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      } else {
        console.error('User ID is not set.');
      }
    }
  }
  

  addImageClickListener(img: HTMLImageElement): void {
    img.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation(); 
      this.currentImage = img;
      this.resizeMenu.nativeElement.style.display = 'block';
      this.resizeMenu.nativeElement.style.left = `${event.pageX}px`;
      this.resizeMenu.nativeElement.style.top = `${event.pageY}px`;
    });
  }
  
  insertImage(imageSrc: string): void {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.cursor = 'pointer';
    img.classList.add('resizable');
  
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents(); 
      range.insertNode(img);
    } else {
      
      this.textInput.nativeElement.appendChild(img);
    }
  
    this.addImageClickListener(img);
  }
  

  toggleImageList(): void {
    const imageListContainer = document.getElementById('imageListContainer');
    if (imageListContainer) {
      imageListContainer.style.display = imageListContainer.style.display === 'none' ? 'block' : 'none';
    }
  }

  // image ends here

  handleImageInsertion(imageSrc: string): void {
    if (this.isInsertingImageHeader) {
      this.insertImageHeader(imageSrc);
      this.isInsertingImageHeader = false;
      const imageListContainer = document.getElementById('imageListContainer');
      if (imageListContainer) {
        imageListContainer.style.display = 'none';
      }
    } else {
      this.insertImage(imageSrc);
    }
  }


  insertTextHeader(): void {
    const headerText = prompt('Enter header text:');
    if (headerText) {
      const header = document.createElement('div');
      header.className = 'header';
      header.textContent = headerText;
      document.body.appendChild(header);
    }
  }
  
  toggleImageListForHeader(): void {
    const imageListContainer = document.getElementById('imageListContainerr');
    if (imageListContainer) {
      imageListContainer.style.display = imageListContainer.style.display === 'none' ? 'block' : 'none';
      this.isInsertingImageHeader = true;
    }
  }
insertImageHeader(imageSrc: string): void {
  const header = document.createElement('div');
  header.className = 'headbutt';
  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  img.style.cursor = 'pointer';
  header.appendChild(img);
  document.body.appendChild(header);
  
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents(); 
    range.insertNode(header);
  } else {
    
    this.textInput.nativeElement.appendChild(header);
  }


  this.addImageClickListener(img);
  this.enableResizing(img);
}

// insert header stops here 



  

  applyHeading(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const headingTag = selectElement.value;
  
    if (headingTag) {
      document.execCommand('formatBlock', false, headingTag);
    }
  }

  handleTextSelection(event: MouseEvent): void {
    const selectedText = window.getSelection()?.toString();
    const textFormatMenu = this.textFormatMenu.nativeElement;

    if (selectedText && textFormatMenu) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        textFormatMenu.style.display = 'block';
        textFormatMenu.style.left = `${rect.left + window.scrollX}px`;
        textFormatMenu.style.top = `${rect.bottom + window.scrollY}px`;
      }
    } else {
      textFormatMenu.style.display = 'none';
    }
  }
  

  initializer(): void {
    
    const fontNameSelect = document.getElementById('fontName') as HTMLSelectElement | null;
    if (fontNameSelect) {
      this.fontList.forEach((font) => {
        const option = document.createElement('option');
        option.value = font;
        option.innerHTML = font;
        fontNameSelect.appendChild(option);
      });
    }

    
    const fontSizeSelect = document.getElementById('fontSize') as HTMLSelectElement | null;
    if (fontSizeSelect) {
      for (let i = 1; i <= 7; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.innerHTML = i.toString();
        fontSizeSelect.appendChild(option);
      }
      fontSizeSelect.value = '3';
    }

    
    const optionsButtons = document.querySelectorAll('.option-button');
    optionsButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.modifyText(button.id, false, null);
      });
    });

    const advancedOptionButtons = document.querySelectorAll('.adv-option-button');
    advancedOptionButtons.forEach((button) => {
      button.addEventListener('change', () => {
        this.modifyText((button as HTMLSelectElement).id, false, (button as HTMLSelectElement).value);
      });
    });

    
    const linkButton = document.getElementById('createLink');
    if (linkButton) {
      linkButton.addEventListener('click', () => {
        let userLink = prompt('Enter a URL');
        if (userLink) {
          if (!/http/i.test(userLink)) {
            userLink = 'http://' + userLink;
          }
          this.modifyText('createLink', false, userLink);
        }
      });
    }

    // Image upload
   if (this.imageUpload) {
    this.imageUpload.nativeElement.addEventListener('change', () => {
      const files = this.imageUpload.nativeElement.files;
      if (files) {
        Array.from(files).forEach(file => {
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = document.createElement('img');
              img.src = (e.target as FileReader).result as string;
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.cursor = 'pointer';
              img.classList.add('resizable');
              this.textInput.nativeElement.appendChild(img);
              this.enableResizing(img);

              this.addImageClickListener(img);
            };
            reader.readAsDataURL(file);
          }
        });
      }
    });
  }



    
    this.highlighter(document.querySelectorAll('.align'), true);
    this.highlighter(document.querySelectorAll('.spacing'), true);
    this.highlighter(document.querySelectorAll('.format'), false);
    this.highlighter(document.querySelectorAll('.script'), true);

  }




  handleFlexToolbar(event: MouseEvent) {
    const selectedText = window.getSelection()?.toString();
    const flexToolbar = document.getElementById("flex-toolbar");

    if (selectedText && flexToolbar) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        this.showFlexToolbar = true;
        this.toolbarLeft = rect.left + window.scrollX;
        this.toolbarTop = rect.bottom + window.scrollY;
      }
    } else {
      this.showFlexToolbar = false;
    }
  }








  modifyText(command: string, defaultUi: boolean, value: string | null): void {
    document.execCommand(command, defaultUi, value ?? '');
  }

  highlighter(className: NodeListOf<Element>, needsRemoval: boolean): void {
    className.forEach((button) => {
      button.addEventListener('click', () => {
        if (needsRemoval) {
          let alreadyActive = false;
          if (button.classList.contains('active')) {
            alreadyActive = true;
          }
          this.highlighterRemover(className);
          if (!alreadyActive) {
            button.classList.add('active');
          }
        } else {
          button.classList.toggle('active');
        }
      });
    });
  }

  highlighterRemover(className: NodeListOf<Element>): void {
    className.forEach((button) => {
      button.classList.remove('active');
    });
  }

  enableResizing(img: HTMLImageElement): void {
    interact(img).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          let x = parseFloat(event.target.getAttribute('data-x') || '0') + event.deltaRect.left;
          let y = parseFloat(event.target.getAttribute('data-y') || '0') + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`
          });

          event.target.setAttribute('data-x', x.toString());
          event.target.setAttribute('data-y', y.toString());
        }
      }
    });
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



 

  }
  