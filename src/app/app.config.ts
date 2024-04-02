import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, RouterModule} from '@angular/router';

import {routes} from './app.routes';
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {authModule} from "./config/auth-module";
import {BrowserModule} from "@angular/platform-browser";

const routerModule = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(routerModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(authModule),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule)
  ]
};
