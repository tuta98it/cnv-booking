import { Pipe, PipeTransform } from '@angular/core';
import { TYPE_AIRLINE_TICKET_OPTIONS } from 'src/app/enums/type-airline-ticket.enum';
import { TEXT_USER_TYPE } from 'src/app/enums/user-type.enum';

@Pipe({
  name: 'userTypePipe'
})
export class UserTypePipe implements PipeTransform {
  transform(valueUserType: any): any {
    if (valueUserType !== null && valueUserType !== undefined) {
      return TEXT_USER_TYPE[valueUserType] || 'Unknown'; // Trả về 'Unknown' nếu không tìm thấy giá trị
    }
    return 'Unknown'; // Trả về 'Unknown' nếu giá trị null hoặc undefined
  }
}
