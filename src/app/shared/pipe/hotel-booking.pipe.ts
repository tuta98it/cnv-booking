import { Pipe, PipeTransform } from '@angular/core';
import { HotelBookingStatusEnum, HOTEL_BOOKING_STATUS_LIST  } from 'src/app/enums/hotel-booking-status.enum';

@Pipe({
  name: 'hotelBookingPipe'
})
export class HotelBookingPipe implements PipeTransform {

  transform(statusValue: number): any {
    switch (statusValue) {
      case HotelBookingStatusEnum.SendRequest:
        return [ HOTEL_BOOKING_STATUS_LIST[0], HOTEL_BOOKING_STATUS_LIST[1], HOTEL_BOOKING_STATUS_LIST[4]];
      case HotelBookingStatusEnum.Holding:
        return [HOTEL_BOOKING_STATUS_LIST[1], HOTEL_BOOKING_STATUS_LIST[0], HOTEL_BOOKING_STATUS_LIST[4]];
      case HotelBookingStatusEnum.Confirmed:
        return [HOTEL_BOOKING_STATUS_LIST[2], HOTEL_BOOKING_STATUS_LIST[3], HOTEL_BOOKING_STATUS_LIST[4]];
      case HotelBookingStatusEnum.Successful:
        return [HOTEL_BOOKING_STATUS_LIST[3]];
      case HotelBookingStatusEnum.Failure:
        return [HOTEL_BOOKING_STATUS_LIST[4]];
    }
  }

}
