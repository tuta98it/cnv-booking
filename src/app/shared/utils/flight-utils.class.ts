import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})

export class FlightUtils {
  toNameAirportByCode(airports: any, code: String) {
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
