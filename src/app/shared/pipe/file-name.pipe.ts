import { Pipe, PipeTransform } from '@angular/core';
import { HotelBookingStatusEnum, HOTEL_BOOKING_STATUS_LIST  } from 'src/app/enums/hotel-booking-status.enum';

@Pipe({
  name: 'fileNamePipe'
})
export class FileNamePipe implements PipeTransform {
  transform(path: string): any {
    return path.split('/').pop();
  }
}
