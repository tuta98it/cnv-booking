import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValueConstants } from '../constants/constant.value';
// FormControl chỉ chứa giá trị trắng
// @minValue - giá trị nhỏ nhất control có thể nhận
export function WhiteSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /\S/;
    let value = control.value;
    const isValid = ValueConstants.NULL_VALUES.includes(value) || pattern.test(value); //nếu chưa được nhập hoặc không chứa toàn space thì hợp lệ
    return isValid ? null : { isWhiteSpace : true, mess: ValueConstants.INVALID_ONLY_WHITE_SPACE };
  };
}
