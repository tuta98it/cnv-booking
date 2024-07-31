import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { AirlineTicketBookingRequestComponent } from './airline-ticket-booking-request/airline-ticket-booking-request.component';
import { AirlineTicketBookingSystemComponent } from './airline-ticket-booking-system/airline-ticket-booking-system.component';
import { ConfirmReserveSeatComponent } from './airline-ticket-booking-request/confirm-reserve-seat/confirm-reserve-seat.component';

const routes: Routes = [
  { path: '', component: AirlineTicketBookingRequestComponent, canActivate: [AuthGuard] },
  {
    path: 'airline-ticket-booking-request', component: AirlineTicketBookingRequestComponent, canActivate: [AuthGuard], data: {
      pagename: 'Book vé yêu cầu',
      breadcrumb: 'Book vé yêu cầu'
    }
  },
  {
    path: 'airline-ticket-booking-system', component: AirlineTicketBookingSystemComponent, canActivate: [AuthGuard], data: {
      pagename: 'Book vé hệ thống',
      breadcrumb: 'Book vé hệ thống'
    }
  },
  {
    path: 'airline-ticket-booking-request/confirm-reserve-seat', component: ConfirmReserveSeatComponent, canActivate: [AuthGuard], data: {
      pagename: 'Xác nhận giữ chỗ từ khách hàng',
      breadcrumb: 'Xác nhận giữ chỗ từ khách hàng'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingServiceRoutingModule { }
