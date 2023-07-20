
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import {Constant} from '../constants/constant.class';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (args)
      return super.transform(value, args );
    else
      return super.transform(value, Constant.DATE_FMT );
  }
  transformHour(value: any, args?: any): any {
    if (args)
      return super.transform(value, args );
    else
      return super.transform(value, Constant.DATE_FMT_HOUR );
  }
  transformFull(value: any, args?: any): any {
    if (args)
      return super.transform(value, args );
    else
      return super.transform(value, Constant.DATE_FMT_FULL);
  }
  transformNotFull(value: any, args?: any): any {
    if (args)
      return super.transform(value, args );
    else
      return super.transform(value, Constant.DATE_FMT_NOT_FULL );
  }
  transformYear(value: any, args?: any): any {
    if (args)
      return super.transform(value, args );
    else
      return super.transform(value, Constant.DATE_FMT_YEAR );
  }
  transformAge(value: any, args?: any): any {
    if (args)
      return new Date().getFullYear() - +super.transform(value, args );
    else
      return new Date().getFullYear() - +super.transform(value, Constant.DATE_FMT_YEAR );
  }
  transformNotFullCode(value: any, args?: any): any {
    if (args)
      return super.transform(value, args );
    else
      return super.transform(value, 'ddMMyy');
  }
  transformSex(value: number): any {
    switch (value) {
      case 1:
        return 'Nam';
      case 0:
        return 'Nữ';
      case 2:
        return 'KXĐ';
      default:
        return '';
    }
  }
}
