export enum BookingHotelStatus {
  SendRequest = 0,
  Holding = 1,
  Confirmed = 2,
  Successful = 3,
  Failure = 4
}

export const BOOKING_HOTEL_STATUS = [
  { label: 'Gửi yêu cầu', value: BookingHotelStatus.SendRequest },
  { label: 'Đang giữ chỗ', value: BookingHotelStatus.Holding },
  { label: 'Đã xác nhận phòng', value: BookingHotelStatus.Confirmed },
  { label: 'Đặt thành công', value: BookingHotelStatus.Successful },
  { label: 'Đặt thất bại', value: BookingHotelStatus.Failure },
];


export const BOOKING_HOTEL_STATUS_TEXT = {
  [BookingHotelStatus.SendRequest]: 'Gửi yêu cầu',
  [BookingHotelStatus.Holding]: 'Đang giữ chỗ',
  [BookingHotelStatus.Confirmed]: 'Đã xác nhận phòng',
  [BookingHotelStatus.Successful]: 'Đặt thành công',
  [BookingHotelStatus.Failure ]: 'Đặt thất bại',
};
