import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'airportPipe'
})
export class AirportPipe implements PipeTransform {
  transform(codeAirline: any): any {
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
