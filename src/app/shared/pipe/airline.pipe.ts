import { Pipe, PipeTransform } from '@angular/core';
import { TYPE_AIRLINE_TICKET_OPTIONS } from 'src/app/enums/type-airline-ticket.enum';

@Pipe({
  name: 'airlinePipe'
})
export class AirlinePipe implements PipeTransform {
  transform(code: any, airports: any): any {
    let mameAirport = '';
    if (code) {
      let airport = airports.find((objAirports: any) => objAirports.code === code);
      if (airport) {
        mameAirport = airport.name;
      }
    }
    return mameAirport;
  }
}
