import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './bootstrap/app.config';
import { AppComponent } from './bootstrap/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
