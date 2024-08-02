import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { IQuestionAndAnswer } from 'src/app/models/chat.model';

@Component({
  selector: 'app-voice-chat-container',
  templateUrl: './voice-chat-container.component.html',
  styleUrls: ['./voice-chat-container.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ 'margin-bottom': '-100px', opacity: 0 }),
        animate('1.5s ease-out', style({ 'margin-bottom': '0px', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('1.5s ease-out', style({ 'margin-bottom': '-100px', opacity: 0 }))
      ])
    ])
  ]
})
export class VoiceChatContainerComponent {
  @Input('data') chatData: IQuestionAndAnswer[] = [];

}
