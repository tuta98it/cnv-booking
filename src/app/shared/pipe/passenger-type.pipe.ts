import { Pipe, PipeTransform } from '@angular/core';
import { Constant } from '../constants/constant.class';

@Pipe({
  name: 'passengerType'
})
export class PassengerTypesPipe implements PipeTransform {
  PASSENGER_TYPE = Constant.PASSENGER_TYPE;
  transform(value: any): any {
    let valueNumber = parseInt(value);
    if (this.PASSENGER_TYPE && value >= 0) {
      let findPassengerType = this.PASSENGER_TYPE.find((objPassengerType: any) => objPassengerType.value === valueNumber);
      if (findPassengerType) {
        return findPassengerType.label;
      }else{
        return '';
      }
    } else {
      return '';
    }
  }

}
