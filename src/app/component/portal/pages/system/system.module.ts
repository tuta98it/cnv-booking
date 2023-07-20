import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {GeneralService} from '../../../../service/general-service';
import {SystemRoutingModule} from './system-routing.module';
import { LogComponent } from './log/log.component';
import {DxDataGridModule} from 'devextreme-angular';



@NgModule({
  declarations: [LogComponent],
  imports: [
    SharedModule,
    SystemRoutingModule,
    DxDataGridModule
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SystemModule { }
