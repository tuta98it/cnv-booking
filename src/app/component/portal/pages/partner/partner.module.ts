import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartnerRoutingModule } from './partner-routing.module';
import { ActionPartnerComponent } from './action-company/action-partner.component';
import { DepositAccountComponent } from './action-company/deposit-account/deposit-account.component';
import { ChangePasswordComponent } from './action-company/change-password/change-password.component';

import {DevExtremeModule} from 'devextreme-angular';
import { EmployeePipe } from 'src/app/shared/pipe/employeePipe.pipe';
@NgModule({
  declarations: [
    ActionPartnerComponent,
    ChangePasswordComponent,
    DepositAccountComponent,
  ],
  imports: [
    SharedModule,
    DevExtremeModule,
    PartnerRoutingModule
  ],
  providers: [GeneralService, EmployeePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PartnerModule { }
