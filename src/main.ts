import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { EntryComponent } from './app/entry/entry.component';

bootstrapApplication(EntryComponent, appConfig)
  .catch((err) => console.error(err));
