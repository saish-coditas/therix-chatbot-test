import { Injectable } from '@angular/core';
import { ConfigurationService } from '../configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isConfigured: boolean = false;
  constructor(private configService: ConfigurationService) {
    configService.getConfigSubject().subscribe(config => config && config.backend_host ? this.isConfigured = true: false);
  }

  getConfigData() {
    return this.isConfigured;
  }
}
