import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralService } from 'src/app/service/general-service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DxDataGridModule } from 'devextreme-angular';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AirlineTicketBookingRequestComponent } from './airline-ticket-booking-request/airline-ticket-booking-request.component';
import { AirlineTicketBookingSystemComponent } from './airline-ticket-booking-system/airline-ticket-booking-system.component';
import { BookingServiceRoutingModule } from './booking-service-routing.module';
import { ConfirmReserveSeatComponent } from './airline-ticket-booking-request/confirm-reserve-seat/confirm-reserve-seat.component';

@NgModule({
  declarations: [
    AirlineTicketBookingRequestComponent,
    AirlineTicketBookingSystemComponent,
    ConfirmReserveSeatComponent

  ],
  imports: [
    BookingServiceRoutingModule,
    SharedModule,
    DxDataGridModule,
    NzModalModule
  ],
  providers: [GeneralService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BookingServiceModule { }
