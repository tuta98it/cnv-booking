import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { ValueConstants } from '../constants/constant.value';
// FormControl có phải 1 Object không
// @mess - thông báo lỗi
export function ObjectValidator(mess: string = ValueConstants.INVALID_DATA): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = ValueConstants.NULL_VALUES.includes(control.value) || typeof control.value === 'object';
    return isValid ? null : { notAnObject: true, mess: mess };
  };
}
// FormControl có phải 1 list Object không
// @mess - thông báo lỗi
export function ArrayObjectValidator(mess: string = ValueConstants.INVALID_DATA): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = (!Array.isArray(control) && control !== null);
    return isValid ? null : { notAnArrayOrNull: true, mess: mess };
  };
}
