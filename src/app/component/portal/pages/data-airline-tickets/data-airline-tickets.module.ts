
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DataAirlineTicketsRoutingModule } from './data-airline-tickets-routing.module';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [],
  imports: [
    DataAirlineTicketsRoutingModule,
    SharedModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DataAirlineTicketsModule {

}
