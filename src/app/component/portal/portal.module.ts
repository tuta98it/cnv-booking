
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { SharedModule } from '../../shared/shared.module';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { PortalRoutingModule } from './portal-routing.module';
import { MasterPageComponent } from './master-page/master-page.component';
import { GeneralService } from '../../service/general-service';
import { FileManagerService } from '../../service/file-manager.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { MenuService } from '../../service/menu.service';
import { RoleComponent } from './pages/role/role.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SignalRService } from '../../service/signal-r.service';
import { DxDataGridModule, DxNumberBoxModule } from 'devextreme-angular';
import { DateFormatPipe } from '../../shared/pipe/format-date.pipe';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SelectUnitComponent } from './pages/control/select-unit/select-unit.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';
import { AdminVoidTicketComponent } from './pages/admin-void-ticket/admin-void-ticket.component';
import { AdminTicketComponent } from './pages/admin-ticket/admin-ticket.component';
import { AdminHistoryHoldingTicketComponent } from './pages/admin-history-holding-ticket/admin-history-holding-ticket.component';
import { HotelComponent } from './pages/hotel/hotel.component';
import { NewsComponent } from './pages/news/news.component';
import { DxDateBoxModule } from 'devextreme-angular';
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);
@NgModule({
  declarations: [
    MasterPageComponent,
    RoleComponent,
    PartnerComponent,
    AdminHistoryHoldingTicketComponent,
    AdminVoidTicketComponent,
    AdminTicketComponent,
    DashboardComponent,
    SelectUnitComponent,
    UserRegisterComponent,
    HotelComponent,
    NewsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([]),
    PortalRoutingModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    ColorPickerModule,
    NgApexchartsModule,
    DxDataGridModule,
    DxNumberBoxModule,
    NzAvatarModule,
    NzTabsModule,
    DxDateBoxModule
  ],
  providers: [GeneralService, FileManagerService, MenuService, SignalRService, DateFormatPipe, ]
})
export class PortalModule {

}
