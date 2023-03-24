//Title:  main.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 14 March 2023
//Description:  TypeScript file for the main.ts.

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
