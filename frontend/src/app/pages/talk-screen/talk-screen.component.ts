import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription, catchError, mergeMap, of, tap } from 'rxjs';
import { IQuestionAndAnswer } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { v4 as uuidv4 } from 'uuid';

declare var webkitSpeechRecognition: new () => any;

@Component({
  selector: 'app-talk-screen',
  templateUrl: './talk-screen.component.html',
  styleUrls: ['./talk-screen.component.scss']
})
export class TalkScreenComponent implements OnDestroy {
  chatHistory: IQuestionAndAnswer[] = [];
  voiceResult!: string;
  vSearch: any;
  isListening: boolean = false;
  private messageProcess$!: Subscription;
  sessionId: string = uuidv4();
  constructor(private _chatService: ChatService, private cd: ChangeDetectorRef) {
    setTimeout(() => {
      this.setChatHistory('system', 'How are you doing today?')
    }, 3000);
  }
  startListening() {
    // let voiceHandler = this.hiddenSearchHandler?.nativeElement;
    if ('webkitSpeechRecognition' in window) {
      this.vSearch = new webkitSpeechRecognition();
      this.vSearch.continuous = false;
      this.vSearch.interimresults = true;
      this.vSearch.lang = 'en-US';
      this.vSearch.start();
      this.isListening = true;
      this.vSearch.onresult = (event: any) => {
        // let interimTranscript = '';
        // for (let i = event.resultIndex; i < event.results.length; i++) {
        //     const transcript = event.results[i][0].transcript;
        //     if (event.results[i].isFinal) {
        //       console.log('if event', event)
        //         // finalTranscript += formatTranscript(transcript);
        //         // startButton.click();
        //     } else {
        //       interimTranscript += transcript;
        //       console.log('interimTranscript', interimTranscript)
        //   }
        //     console.log(event)
        // }
        // transcriptDiv.innerHTML = finalTranscript + '<i style="color:#616161;">' + interimTranscript + '</i>';
        // voiceHandler.value = e?.results[0][0]?.transcript;
        this.voiceResult = event.results[0][0].transcript;
        this.vSearch.stop();
        this.cd.detectChanges();
        this.handleMessageEvent(event.results[0][0].transcript);
        // this.getResult(event.results[0][0].transcript);
        // console.log(this.results);
      };
    } else {
      alert('Your browser does not support voice recognition!');
    }
  }

  stopListening() {
    this.vSearch.stop();
    this.isListening = false;
  }
  getResult(transcript: string) {
    console.log(this.voiceResult);
    this.setChatHistory('user', transcript);
    this.voiceResult = '';
    this.cd.detectChanges();
    setTimeout(() => {
      this.setChatHistory('system', 'dummy');
      this.cd.detectChanges();
    }, 3000);
  }

  handleMessageEvent(message: string) {
    if (message.trim() == '') {
      return;
    }
    this.messageProcess$ = of({}).pipe(
      tap(() => { 
        this.voiceResult = '';
        this.setChatHistory('user', message);
        this.cd.detectChanges();
      }),
      mergeMap(() => this._chatService.voiceChat(message, this.sessionId).pipe(
        catchError( () => {
          this.setChatHistory('system', 'Failed to load message. Try again!!');
          this.cd.detectChanges();
          return of(undefined)
        })
      ))
    ).subscribe((res:any) => {
      if (res && res.answer) {
        this.setChatHistory('system', res.answer);
        this.cd.detectChanges();
      }
    });
  }

  setChatHistory(from: 'user' | 'system', text: string) {
    this.chatHistory.push({ from, text});
    // if (this.chatHistory.length > 3) {
    //   this.chatHistory.shift();
    // }
  }

  ngOnDestroy(): void {
    this.messageProcess$?.unsubscribe();
  }

}
