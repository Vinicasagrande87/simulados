import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // Removi o .component porque seu arquivo chama app.ts

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));