export enum AirlineCompany {
  Nothing = 0,
  VietnamAirline = "VN",
  BambooAirways = "QH",
  VietjetAir = "VJ",
  ALL = 999,
}

export const AIRLINE_CODE_OPTIONS = [
  { label: 'Vietnam Airlines', value: AirlineCompany.VietnamAirline },
  { label: 'Bamboo Airways', value: AirlineCompany.BambooAirways },
  { label: 'VietJet Air', value: AirlineCompany.VietjetAir },
];
