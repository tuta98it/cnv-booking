import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  NotificationsRoutingModule } from './notifications-routing.module';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    NotificationsRoutingModule
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsModule { }
