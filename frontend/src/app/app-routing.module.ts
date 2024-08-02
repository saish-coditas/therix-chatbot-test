import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatScreenComponent } from './pages/chat-screen/chat-screen.component';
import { TalkScreenComponent } from './pages/talk-screen/talk-screen.component';
import { authGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  {
    path: 'chat',
    component: ChatScreenComponent,
    canActivate: [authGuard]
  },
  {
    path: 'talk',
    component: TalkScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
