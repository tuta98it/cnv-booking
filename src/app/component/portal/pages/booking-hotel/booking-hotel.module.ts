
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BookingHotelRoutingModule } from './booking-hotel-routing.module';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { PhoneUtils } from 'src/app/shared/utils/phone-utils.class';
import { ConfirmReserveSeatHotelComponent } from './confirm-reserve-seat/confirm-reserve-seat-hotel.component';

@NgModule({
  declarations: [ConfirmReserveSeatHotelComponent],
  imports: [
    BookingHotelRoutingModule,
    SharedModule,
  ],
  providers: [GeneralService, PhoneUtils],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BookingHotelModule {

}
