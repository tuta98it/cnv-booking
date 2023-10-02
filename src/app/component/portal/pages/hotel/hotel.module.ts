
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HotelRoutingModule } from './hotel-routing.module';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [EditHotelComponent],
  imports: [
    HotelRoutingModule,
    SharedModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HotelModule {

}
