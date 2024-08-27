import { Pipe, PipeTransform } from '@angular/core';
import { TEXT_PARTNER_STATUS } from 'src/app/enums/partner-status.enum';


@Pipe({
  name: 'partnerStatusPipe'
})
export class PartnerStatusPipe implements PipeTransform {
  transform(valuePartnerStatus: any): any {
    if (valuePartnerStatus !== null && valuePartnerStatus !== undefined) {
      return TEXT_PARTNER_STATUS[valuePartnerStatus] || 'Unknown'; // Trả về 'Unknown' nếu không tìm thấy giá trị
    }
    return 'Unknown'; // Trả về 'Unknown' nếu giá trị null hoặc undefined
  }
}
