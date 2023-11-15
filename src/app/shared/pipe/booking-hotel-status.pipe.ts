import { Pipe, PipeTransform } from '@angular/core';
import { Constant } from '../constants/constant.class';

@Pipe({
  name: 'bookingHotelStatus'
})
export class BookingHotelStatusPipe implements PipeTransform {
  STATUS_BOOKING_HOTEL = Constant.STATUS_BOOKING_HOTEL;
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
