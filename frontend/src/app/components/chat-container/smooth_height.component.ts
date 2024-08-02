import {ElementRef, HostBinding, Component, Input, OnChanges, ViewEncapsulation} from '@angular/core';

import {
  animate, style, transition, trigger
} from "@angular/animations";

@Component({
  selector: 'app-smooth-height',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
      overflow: hidden;
    }
  `],
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition('* <=> *', [
        style({height: '{{startHeight}}px', opacity: 0}),
        animate('1.5s ease-out'),
      ], {params: {startHeight: 0}})
    ])
  ]
})
export class SmoothHeightComponent implements OnChanges {
  @Input()
  trigger!: any;

  startHeight!: number;

  constructor(private element: ElementRef) {}  
  
  @HostBinding('@grow') get grow() {
    return {value: this.trigger, params: {startHeight: this.startHeight}};
  }
  
  setStartHeight(){
    this.startHeight = this.element.nativeElement.clientHeight;
  }
  
  ngOnChanges(){
    this.setStartHeight();
  }
}
