import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})

export class PhoneUtils {
  phoneNumberFormat(value: any) {
    let phoneNo = value;
    if (value) {
      const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);
      if (USNumber) {
        phoneNo = `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}`;
      }
    }
    return phoneNo;
  }

}
