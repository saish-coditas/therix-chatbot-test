import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  config!: { tenant_name: string, backend_host: string};

  constructor(private http: HttpClient, private configService: ConfigurationService) {
      this.config = configService.configData;
  }

  chat(message: string, sessionId: string) {
    return this.http.get(
      `${this.config.backend_host}/chat?session_id=${sessionId}&user_input=${message}`
    );
  }

  voiceChat(message: string, sessionId: string) {
    return this.http.get(
      `${this.config.backend_host}/audio-chat?session_id=${sessionId}&user_input=${message}`
    );
  }

  suggestQustion(noOfQuesion: number = 4) {
    return this.http.get(
      `${this.config.backend_host}/sample-questions?num_of_questions=${noOfQuesion}`
    );
  }

}
