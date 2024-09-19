import { Pipe, PipeTransform } from '@angular/core';
import { TYPE_AIRLINE_TICKET_OPTIONS } from 'src/app/enums/type-airline-ticket.enum';

@Pipe({
  name: 'genderPipe'
})
export class GenderPipe implements PipeTransform {
  transform(gender: any): any {

    if (gender == true || gender == 1) {
      return "Nam"
    } else if (gender == false || gender == 0) {
      return "Nữ"
    } else {
      return "Không xác định"
    }
  }
}
