import { Injectable } from '@angular/core';
import { Constant } from "../constants/constant.class";
@Injectable({
  providedIn: 'root',
})
export class PipeUtils {
  pipePassengerType(value: any) {
    let valueNumber = parseInt(value);
    if (Constant.PASSENGER_TYPE && value >= 0) {
      let findPassengerType = Constant.PASSENGER_TYPE.find((objPassengerType: any) => objPassengerType.value === valueNumber);
      if (findPassengerType) {
        return findPassengerType.label;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
