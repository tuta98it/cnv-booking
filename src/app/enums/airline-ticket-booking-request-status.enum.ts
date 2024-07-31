export enum AirlineTicketBookingRequestStatus {
  SubmitRequest = 1,
  ReserveSeat = 2,
  ReceivedTicket = 3,
  ExpiredTicket = 4,
  IssuedTicket = 5,
  AdjustTicket = 6,
  All = 999,
}

export const AIRLINE_TICKET_BOOKING_REQUEST_STATUS_OPTIONS = [
  { label: '--Tất cả--', value: AirlineTicketBookingRequestStatus.All },
  { label: 'Gửi yêu cầu', value: AirlineTicketBookingRequestStatus.SubmitRequest },
  { label: 'Đang giữ chỗ', value: AirlineTicketBookingRequestStatus.ReserveSeat },
  { label: 'Đã xác nhận vé', value: AirlineTicketBookingRequestStatus.ReceivedTicket },
  { label: 'Hết hạn giữ vé', value: AirlineTicketBookingRequestStatus.ExpiredTicket },
  { label: 'Xuất vé', value: AirlineTicketBookingRequestStatus.IssuedTicket },
  { label: 'Điều chỉnh vé', value: AirlineTicketBookingRequestStatus.AdjustTicket },
];
