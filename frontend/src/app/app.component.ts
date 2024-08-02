import { Component, Inject } from '@angular/core';
import { ConfigurationService } from './services/configuration.service';
import { AuthService } from './services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WINDOW } from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'therix-frontend';
  constructor(@Inject(WINDOW) private window: Window, private configService: ConfigurationService, private authService: AuthService) {
    console.log(this.window.location.hostname.split('.')[0])
    if (!authService.getConfigData()) {
      this.setConfiguration(this.window.location.hostname?.split('.')[0] || 'chat');
    }
  }

  setConfiguration(tenant: string) {
    this.configService.getConfiguration(tenant).subscribe((configs: any) => {
      if (configs && configs.length) {
        const configData = configs.find((config: { tenant_name: string, backend_host: string}) => config.tenant_name === tenant);
        if (configData && configData.backend_host) {
          this.configService.setConfigSubject(configData);
        } else {
          // this.configService.setConfigSubject({ tenant_name: 'chat', backend_host: 'https://xcagpmil7jhilripq6eesyyzmy0ecdsh.lambda-url.ap-south-1.on.aws'});
          throw new Error(`Could not find tenant`);
        }
      }
    }, err => {
      console.error(err);
    });
  }
}
