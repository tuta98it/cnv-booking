export enum TypeAirlineTicket {
  OneWay = 0,
  RoundTrip = 1,
}

export const TYPE_AIRLINE_TICKET_OPTIONS = [
  { label: 'Một chiều', value: TypeAirlineTicket.OneWay },
  { label: 'Hai chiều', value: TypeAirlineTicket.RoundTrip },
]
