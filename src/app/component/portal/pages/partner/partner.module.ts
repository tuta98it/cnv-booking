import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartnerRoutingModule } from './partner-routing.module';
import { ActionPartnerComponent } from './action-company/action-partner.component';
import { DepositAccountComponent } from './action-company/deposit-account/deposit-account.component';



@NgModule({
  declarations: [
    ActionPartnerComponent,
    DepositAccountComponent,
  ],
  imports: [
    SharedModule,
    PartnerRoutingModule
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PartnerModule { }
