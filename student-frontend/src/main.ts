import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Buffer } from 'buffer';
import { provideEffects } from '@ngrx/effects';
import { StudentsEffects } from './app/features/student/store/student.effects';

(window as any).Buffer=Buffer;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
