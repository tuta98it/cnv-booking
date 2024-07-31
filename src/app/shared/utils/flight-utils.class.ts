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

  toAirlineNameByCode(codeAirline: string) {
    switch (codeAirline) {
      case "VN":
        return "Vietnam Airlines";
      case "QH":
        return "Bamboo Airways";
      case "VJ":
        return "VietJet Air";
      default:
        return "";
    }
  }
}
