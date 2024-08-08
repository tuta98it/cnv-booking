import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartnerRoutingModule } from './partner-routing.module';
import { ActionPartnerComponent } from './action-company/action-partner.component';



@NgModule({
  declarations: [
    ActionPartnerComponent,
  ],
  imports: [
    SharedModule,
    PartnerRoutingModule
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PartnerModule { }
