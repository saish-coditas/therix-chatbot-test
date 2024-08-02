import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  configSubject$: Subject<{ tenant_name: string, backend_host: string}> = new Subject();
  configData!: { tenant_name: string, backend_host: string};

  constructor(private http: HttpClient) { }

  getConfigSubject(){
    return this.configSubject$.asObservable();
  }

  setConfigSubject(obj: any){
    this.configSubject$.next(obj);
    this.configData = obj;
  }

  getConfiguration(tenant: string) {
    return this.http.get(
      // `${environment.apiURL}/get_config`
      `/assets/configuration.json`
    );
  }
}
