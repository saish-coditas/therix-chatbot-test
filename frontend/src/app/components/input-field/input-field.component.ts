import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnChanges {
  messageText: string = '';
  @Input('disable') disable: boolean = false;
  @Output('messageTextEvent') messageTextEvent = new EventEmitter<string>();
  @ViewChild('inputField') private inputField!: ElementRef;

  sendMessage(message: string): void {
    this.messageTextEvent.next(message);
    this.messageText = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['disable'].currentValue) {
      try {
        setTimeout(()=>{
          this.inputField.nativeElement.focus();
        },0);
      } catch(err) { }  
    }
  }
}
