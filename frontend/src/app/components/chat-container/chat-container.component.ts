import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IQuestionAndAnswer } from 'src/app/models/chat.model';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ 'margin-bottom': '-240px', opacity: 0 }),
        animate('2s ease', style({ 'margin-bottom': '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('2s ease', style({ 'margin-bottom': '-240px', opacity: 0 }))
      ])
    ])
  ]
})
export class ChatContainerComponent implements OnChanges, AfterViewInit {
  @Input('data') chatData: IQuestionAndAnswer[] = [];
  @Input('loading') loading = true;
  @ViewChild('scrollable') private scrollContainer!: ElementRef;
  @ViewChild('chatWrapper') private chatWrapper!: ElementRef;
  isScrollToBottom: boolean = true;
  dummyData = "The code for checking bed availability in the nursing unit is part of the SQL query that is constructed within the JSP file. Specifically, it involves executing a SQL statement that counts the total number of beds and the number of available and occupied beds for a given nursing unit.\n\nHere is the relevant portion of the code:\n\n```java\n// SQL query for open location YN\nsql.append(\"SELECT  COUNT(*) OVER () rowCount, a.nursing_unit_code, a.short_desc, a.patient_class APPL_PATIENT_CLASS,\");\nsql.append(\" patient_class, (SELECT COUNT (*) FROM ip_nursing_unit_bed \");\nsql.append(\"WHERE nursing_unit_code = a.nursing_unit_code AND facility_id = \"); \nsql.append(\"a.facility_id AND eff_status = 'E' AND pseudo_bed_yn = 'N') total_beds,\");\nsql.append(\"(SELECT COUNT (*) FROM ip_nursing_unit_bed WHERE nursing_unit_code = \"); \nsql.append(\"a.nursing_unit_code AND facility_id = a.facility_id AND eff_status = 'E' \");\nsql.append(\"AND pseudo_bed_yn = 'N' AND current_status = 'A') available,(SELECT \"); \nsql.append(\"COUNT(*) FROM ip_nursing_unit_bed WHERE nursing_unit_code = \"); \nsql.append(\"a.nursing_unit_code AND facility_id = a.facility_id AND eff_status = 'E' \");\nsql.append(\"AND pseudo_bed_yn = 'N' AND current_status = 'O') occupied \");\n```\n\n### Explanation of the Code:\n1. **Total Beds**: The first subquery counts all beds in the `ip_nursing_unit_bed` table that match the specific nursing unit and facility, ensuring they are effective and not pseudo beds. This value is assigned to `total_beds`.\n\n2. **Available Beds**: The second subquery counts beds that are currently available (i.e., their status is 'A') under the same conditions. This value is assigned to `available`.\n\n3. **Occupied Beds**: The third subquery counts beds that are currently occupied (i.e., their status is 'O') under the same conditions. This value is assigned to `occupied`.\n\nThis SQL query is executed later in the code, and the results are used to display bed availability for the nursing units based on the user's search criteria."

  constructor() {
  }

  ngAfterViewInit(): void {
    // this.scrollToBottom(); 
  }
  ngOnChanges(changes: SimpleChanges) { 
    // this.scrollToBottom();
    // if (changes['loading'] !== undefined || changes['chatData'])    {
    //   setTimeout(() => {
    //     this.scrollToBottom();
    //   }, 500);        
    // }
  } 

  scrollToBottom(): void {

      try {
          // this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
          this.scrollContainer.nativeElement.scroll({
            top: this.scrollContainer.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
          });
          this.isScrollToBottom = true;
      } catch(err) { }                 
  }

  onContainerScroll() {
    let limit = this.scrollContainer.nativeElement.scrollHeight - this.scrollContainer.nativeElement.clientHeight;
    if (this.scrollContainer.nativeElement.scrollTop === limit || this.scrollContainer.nativeElement.scrollTop === 0) {
      this.isScrollToBottom = true;
    } else {
      this.isScrollToBottom = false;
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
}
