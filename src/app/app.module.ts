import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from './component/admin-layout/layout.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {UserModule} from './component/user/user.module';
import {RoleModule} from './component/role/role.module';
import {LoaderService} from './service/loader.service';
import {AppConfigService} from '../app-config.service';
import {AuthModule} from './component/auth/auth.module';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {GroupModule} from './component/group/group.module';
import {ErrorInterceptor} from './shared/interceptor/error.interceptor';
import {AuthGuard} from './shared/guards/guards.class';
import {PageDefaultModule} from './shared/component/page-default/page-default.module';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
export function configServiceFactory(config: AppConfigService) {
  return () => config.load();
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    UserModule,
    RoleModule,
    AuthModule,
    GroupModule,
    PageDefaultModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument(),
  ],
  exports: [ ],
  providers: [ LoaderService, AppConfigService, {
    provide: APP_INITIALIZER,
    useFactory: configServiceFactory,
    deps: [AppConfigService],
    multi: true
  }, { provide: NZ_I18N, useValue: en_US }, {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }, AuthGuard],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
