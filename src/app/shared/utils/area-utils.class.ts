import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})

export class AreaUtils {
  areaNumberFormat(value: any) {
    if (!value) {
      return '0 m2';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' m2';
  }
}
