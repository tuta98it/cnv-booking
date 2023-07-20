import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [TranslateModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class I18nModule {
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'vn']);
    translate.setDefaultLang('en');
  }
}

export function translateLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
