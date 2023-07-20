
import { NgModule} from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {AdminLayoutComponent} from './admin-layout.component';
import {SharedModule} from '../../shared/shared.module';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
import {RouterModule} from '@angular/router';
import {AdminLayoutRoutingModule} from './admin-layout-routing.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {NZ_ICONS} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);
@NgModule({
  declarations: [
    AdminLayoutComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([]),
    AdminLayoutRoutingModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzLayoutModule,
    NzAvatarModule,
    NzPageHeaderModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, { provide: NZ_ICONS, useValue: icons }]
})
export class LayoutModule {

}
