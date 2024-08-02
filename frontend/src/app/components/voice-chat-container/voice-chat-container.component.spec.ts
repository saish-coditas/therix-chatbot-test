import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceChatContainerComponent } from './voice-chat-container.component';

describe('VoiceChatContainerComponent', () => {
  let component: VoiceChatContainerComponent;
  let fixture: ComponentFixture<VoiceChatContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoiceChatContainerComponent]
    });
    fixture = TestBed.createComponent(VoiceChatContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
