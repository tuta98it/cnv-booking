import { Pipe, PipeTransform } from '@angular/core';
import { Constant } from '../constants/constant.class';
import { BOOKING_HOTEL_STATUS } from 'src/app/enums/booking-hotel-status.enum';

@Pipe({
  name: 'bookingHotelStatus'
})
export class BookingHotelStatusPipe implements PipeTransform {
  STATUS_BOOKING_HOTEL = BOOKING_HOTEL_STATUS;
  transform(value: number): any {
    if (this.STATUS_BOOKING_HOTEL && value >= 0) {
      let findStatusBokingHotel = this.STATUS_BOOKING_HOTEL.find((objStatusBokingHotel: any) => objStatusBokingHotel.value === value);
      if (findStatusBokingHotel) {
        return findStatusBokingHotel.label;
      }else{
        return 'ERROR';
      }
    } else {
      return 'ERROR';
    }
  }

}
