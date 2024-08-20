export enum PaymentPeriod {
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
  QUARTER = 4,
  YEAR = 5
}

export const PAYMENT_PERIOD_FULL_OPTIONS = [
  { label: 'Ngày', value: PaymentPeriod.DAY },
  { label: 'Tuần', value: PaymentPeriod.WEEK },
  { label: 'Tháng', value: PaymentPeriod.MONTH },
  { label: 'Quý', value: PaymentPeriod.QUARTER },
  { label: 'Năn', value: PaymentPeriod.YEAR },
]


export const PAYMENT_PERIOD_VHL_OPTIONS = [
  { label: 'Tuần', value: PaymentPeriod.WEEK },
  { label: 'Tháng', value: PaymentPeriod.MONTH },
]
