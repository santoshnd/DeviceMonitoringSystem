import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiCOnfig } from '../core/api-config';

// shape of config api response
class EnvConfig {
  availableLanguages?: string[];
  environment?: string;
  environmentColour?: string;
  environmentName?: string;
  endpoints?: {}
}

@Component({
  selector: 'app-env',
  templateUrl: './env.component.html',
  styleUrls: ['./env.component.scss']
})
export class EnvComponent implements OnInit {
  envConfigUrl = ApiCOnfig.BASE_CONFIG;
  environmentColour: string = '';
  environmentName: string = '';

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getEnvConfiguration()
      .subscribe({
        next: (config: EnvConfig) => {
          this.environmentName = config.environmentName as string;
          this.environmentColour = config.environmentColour as string;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  getEnvConfiguration() {
    return this.http.get(this.envConfigUrl);
  }

}
