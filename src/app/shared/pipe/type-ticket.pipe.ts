import { Pipe, PipeTransform } from '@angular/core';
import { TYPE_AIRLINE_TICKET_OPTIONS } from 'src/app/enums/type-airline-ticket.enum';

@Pipe({
  name: 'typeTicketPipe'
})
export class TypeTicketPipe implements PipeTransform {
  transform(valueTypeTicket: any): any {
    let labelTypeTicket = ""
    if (valueTypeTicket != null && valueTypeTicket != undefined) {
      let opTypeTicket = TYPE_AIRLINE_TICKET_OPTIONS.find((t: any) => t.value == valueTypeTicket);
      if (opTypeTicket) {
        labelTypeTicket = opTypeTicket.label
      }
    }
    return labelTypeTicket;
  }


}
