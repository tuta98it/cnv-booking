export enum AirlineTicketBookingRequestStatus {
  SubmitRequest = 1,
  ReserveSeat = 2,
  ReceivedTicket = 3,
  ExpiredTicket = 4,
  AdjustTicket = 5,
  IssuedTicket = 6,
  FailureTicket = 7,
  All = 999,
}

export const AIRLINE_TICKET_BOOKING_REQUEST_STATUS_OPTIONS = [
  { label: '--Tất cả--', value: AirlineTicketBookingRequestStatus.All },
  { label: 'Gửi yêu cầu', value: AirlineTicketBookingRequestStatus.SubmitRequest },
  { label: 'Đang giữ vé', value: AirlineTicketBookingRequestStatus.ReserveSeat },
  { label: 'Đã xác nhận giữ vé', value: AirlineTicketBookingRequestStatus.ReceivedTicket },
  { label: 'Hết hạn giữ vé', value: AirlineTicketBookingRequestStatus.ExpiredTicket },
  { label: 'Điều chỉnh vé', value: AirlineTicketBookingRequestStatus.AdjustTicket },
  { label: 'Xuất vé', value: AirlineTicketBookingRequestStatus.IssuedTicket },
  { label: 'Xuất vé thất bại', value: AirlineTicketBookingRequestStatus.FailureTicket },
];
