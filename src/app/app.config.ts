import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
// (optional) DI interceptors
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    // { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
  ],
};
