export enum HotelBookingStatusEnum {
  SendRequest = 0,
  Holding = 1,
  Confirmed = 2,
  Successful = 3,
  Failure = 4
}
export const HOTEL_BOOKING_STATUS_LIST = [
  { name: 'Gửi yêu cầu', value: 0 },
  { name: 'Đang giữ chỗ', value: 1 },
  { name: 'Đã xác nhận phòng', value: 2 },
  { name: 'Đặt thành công', value: 3 },
  { name: 'Đặt thất bại', value: 4 },
]
