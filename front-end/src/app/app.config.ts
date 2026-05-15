import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(IonicModule.forRoot({
      mode: 'md' // Força o modo Material Design para garantir consistência visual
    }))
  ]
};