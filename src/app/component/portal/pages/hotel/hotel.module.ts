
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HotelRoutingModule } from './hotel-routing.module';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { GeneralService } from 'src/app/service/general-service';

@NgModule({
  declarations: [EditHotelComponent],
  imports: [
    HotelRoutingModule,
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HotelModule {

}
