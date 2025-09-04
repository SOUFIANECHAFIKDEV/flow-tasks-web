import { bootstrapApplication } from '@angular/platform-browser';      // <-- not platform-server
import { provideServerRendering } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const serverConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideServerRendering(),   // <--- critical for SSR
  ],
};

export default function bootstrap() {
  return bootstrapApplication(AppComponent, serverConfig);
}
