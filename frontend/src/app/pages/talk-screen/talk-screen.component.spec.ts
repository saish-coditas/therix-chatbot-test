import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkScreenComponent } from './talk-screen.component';

describe('TalkScreenComponent', () => {
  let component: TalkScreenComponent;
  let fixture: ComponentFixture<TalkScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TalkScreenComponent]
    });
    fixture = TestBed.createComponent(TalkScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
