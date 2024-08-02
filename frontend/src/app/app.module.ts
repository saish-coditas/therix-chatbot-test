import { FactoryProvider, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { ChatScreenComponent } from './pages/chat-screen/chat-screen.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { FormsModule } from '@angular/forms';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { TalkScreenComponent } from './pages/talk-screen/talk-screen.component';
import { SmoothHeightComponent } from './components/chat-container/smooth_height.component';
import { VoiceChatContainerComponent } from './components/voice-chat-container/voice-chat-container.component';
import { MarkdownModule } from 'ngx-markdown';
export const WINDOW = new InjectionToken<Window>('window');

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};

export const WINDOW_PROVIDERS = [
    windowProvider
]
@NgModule({
  declarations: [
    AppComponent,
    InputFieldComponent,
    ChatScreenComponent,
    NavBarComponent,
    CardComponent,
    ChatContainerComponent,
    SvgIconComponent,
    TalkScreenComponent,
    SmoothHeightComponent,
    VoiceChatContainerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    MarkdownModule.forRoot()
  ],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
