import { Pipe, PipeTransform } from '@angular/core';
import { Constant } from '../constants/constant.class';

@Pipe({
  name: 'employeePipe'
})
export class EmployeePipePipe implements PipeTransform {
  transform(employeeId: number, employees : any[]): any {
    if (employeeId >= 1) {
      let findEmployee = employees.find((objEmployee: any) => objEmployee.id === employeeId);
      if (findEmployee) {
        return `${findEmployee.fullname ?? ''}${findEmployee.email ?  ` - ${findEmployee.email}` : ''}`;
      }else{
        return 'Unknown';
      }
    } else {
      return 'Error';
    }
  }

}
