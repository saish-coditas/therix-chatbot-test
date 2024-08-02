import { Component } from '@angular/core';
import { Subscription, catchError, delay, map, mergeMap, of, tap } from 'rxjs';
import { IGetSuggestions, IQuestionAndAnswer } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss']
})
export class ChatScreenComponent {
  suggestionQuestions: string[] = [];

  isChatContainerShow: boolean = false;

  chatHistory: IQuestionAndAnswer[] = [];
  sessionId: string = uuidv4();
  isLoading: boolean = false;
  private messageProcess$!: Subscription;
  private suggestionQustion$!: Subscription;

  constructor(private _chatService: ChatService) {
    this.getSuggestionQuestions();
  }

  getSuggestionQuestions() {
    this.suggestionQustion$ = this._chatService.suggestQustion().subscribe({
      next: (res: any) => {
        if (res && res.questions) {
          this.suggestionQuestions = res.questions;
        }
      }
    });
  }

  handleMessageEvent(message: string) {
    if (message.trim() == '') {
      return;
    }
    this.isChatContainerShow = true;
    this.messageProcess$ = of({}).pipe(
      delay(100),
      tap(() => { this.isLoading = true; this.setChatHistory('user', message) }),
      delay(1200),
      tap(() => this.setChatHistory('system', '', true) ),
      mergeMap(() => this._chatService.chat(message, this.sessionId).pipe(
        catchError( () => {
          this.chatHistory[this.chatHistory.length - 1].text = 'Failed to load message. Try again!!';
          this.chatHistory[this.chatHistory.length - 1].loading = false;
          this.isLoading = false;
          return of(undefined)
        })
      ))
    ).subscribe((res:any) => {
      if (res && res.answer) {
        this.chatHistory[this.chatHistory.length - 1].text = res.answer;
        this.chatHistory[this.chatHistory.length - 1].loading = false;
        this.chatHistory[this.chatHistory.length - 1].pageNumber = res.page_number;
        this.chatHistory[this.chatHistory.length - 1].source = res.source;
      }
      this.isLoading = false;
    });
    // this.setChatHistory('user', message);
    // this.isLoading = true;
    // setTimeout(() => {
    //   this.setChatHistory('system', '', true);
    // }, 2000);
    
    // this._chatService.chat(message, this.sessionId).subscribe((res: any) => {
    //   if (res && res.answer) {
    //     this.chatHistory[this.chatHistory.length - 1].text = res.answer;
    //     this.chatHistory[this.chatHistory.length - 1].loading = false;
    //   }
    //   this.isLoading = false;
    // }, (err) => {
    //   this.chatHistory[this.chatHistory.length - 1].text = 'Failed to load message. Try again!!';
    //   this.chatHistory[this.chatHistory.length - 1].loading = false;
    //   this.isLoading = false;
    // });
  }

  setChatHistory(from: 'user' | 'system', text: string, loading: boolean = false) {
    this.chatHistory.push({from, text, loading});
  }

  ngOnDestroy(): void {
    this.messageProcess$?.unsubscribe();
    this.suggestionQustion$?.unsubscribe();
  }
}
