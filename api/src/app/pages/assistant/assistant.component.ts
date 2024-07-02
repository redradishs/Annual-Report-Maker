import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, NgClass } from '@angular/common';

interface Message {
  content: string;
  type: 'user' | 'ai';
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [NavbarComponent, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css'
})
export class AssistantComponent {
  userMessage: string = '';
  messages: Message[] = [];
  apiEndpoint = 'https://api.perplexity.ai/chat/completions';
  bearerToken = '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'; // Replace with your actual Bearer token

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    document.getElementById('open-chatbox')?.addEventListener('click', () => {
      const chatbox = document.getElementById('chatbox');
      if (chatbox) {
        chatbox.classList.remove('chatbox-hidden');
        chatbox.style.display = 'flex';
      }
    });
  }

  closeChatbox(): void {
    const chatbox = document.getElementById('chatbox');
    if (chatbox) {
      chatbox.classList.add('chatbox-hidden');
      chatbox.style.display = 'none';
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (this.userMessage.trim() !== '') {
      this.messages.push({ content: this.userMessage, type: 'user' });
      this.scrollChatToBottom();
      this.fetchResponseFromAPI(this.userMessage);
      this.userMessage = '';
    }
  }

  fetchResponseFromAPI(userMessage: string): void {
    const requestData = {
      model: 'llama-3-70b-instruct',
      stream: false,
      max_tokens: 300,
      frequency_penalty: 1,
      temperature: 0.5,
      messages: [
        { role: 'system', content: 'You are Arco you are a precise report maker, you dont use highfalutin words you humanize the contents and generate the reports of users when asked.' },
        { role: 'user', content: userMessage }
      ]
    };

    this.http.post<any>(this.apiEndpoint, requestData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.bearerToken}`
      }
    }).subscribe(
      data => {
        const message = data.choices[0].message.content;
        this.messages.push({ content: message, type: 'ai' });
        this.scrollChatToBottom();
      },
      error => {
        console.error('Error fetching data:', error);
        this.messages.push({ content: 'Failed to load data.', type: 'ai' });
        this.scrollChatToBottom();
      }
    );
  }

  copyMessage(event: any): void {
    const message = event.target.closest('.message').textContent.replace('Copy', '').trim();
    navigator.clipboard.writeText(message).then(() => {
      alert('Message copied to clipboard');
    });
  }

  scrollChatToBottom(): void {
    setTimeout(() => {
      const messageElement = document.getElementById('chatbox-body');
      if (messageElement) {
        messageElement.scrollTop = messageElement.scrollHeight;
      }
    }, 100);
  }
}