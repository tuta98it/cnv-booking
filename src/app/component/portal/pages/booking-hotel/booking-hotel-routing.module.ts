import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/guards.class';
import { BookingHotelComponent } from './booking-hotel.component';
import { ConfirmReserveSeatHotelComponent } from './confirm-reserve-seat/confirm-reserve-seat-hotel.component';
const routes: Routes = [
  {
    path: '', component: BookingHotelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'confirm-reserve-seat', component: ConfirmReserveSeatHotelComponent,
    // canActivate: [AuthGuard],
    data: {
      pagename: 'Xác nhận giữ chỗ khách sạn',
      breadcrumb: 'Xác nhận giữ chỗ khách sạn'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingHotelRoutingModule {
}
