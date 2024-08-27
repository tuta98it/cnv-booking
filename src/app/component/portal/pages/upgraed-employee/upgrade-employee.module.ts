import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpgradeEmployeeComponent } from './upgrade-employee.component';
import { UpgradeEmployeeRoutingModule } from './upgrade-employee-routing.module';



@NgModule({
  declarations: [
    UpgradeEmployeeComponent,
  ],
  imports: [
    SharedModule,
    UpgradeEmployeeRoutingModule
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UpgradeEmployeeModule { }
