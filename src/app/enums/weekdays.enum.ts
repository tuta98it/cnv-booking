export enum Weekdays {
  //
  // Summary:
  //     Indicates Sunday.
  Sunday = 0,
  //
  // Summary:
  //     Indicates Monday.
  Monday = 1,
  //
  // Summary:
  //     Indicates Tuesday.
  Tuesday = 2,
  //
  // Summary:
  //     Indicates Wednesday.
  Wednesday = 3,
  //
  // Summary:
  //     Indicates Thursday.
  Thursday = 4,
  //
  // Summary:
  //     Indicates Friday.
  Friday = 5,
  //
  // Summary:
  //     Indicates Saturday.
  Saturday = 6
}

export const WEEKDAYS_OPTIONS = [
  { label: 'Thứ hai', value: Weekdays.Monday },
  { label: 'Thứ ba', value: Weekdays.Tuesday },
  { label: 'Thứ tư', value: Weekdays.Wednesday },
  { label: 'Thứ năm', value: Weekdays.Thursday },
  { label: 'Thứ sáu', value: Weekdays.Friday },
  { label: 'Thứ bảy', value: Weekdays.Saturday },
  { label: 'Chủ nhật', value: Weekdays.Sunday },
]
