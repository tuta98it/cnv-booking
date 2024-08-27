export enum EmployeeStatus {
  LOCKED = 0,
  ACTIVE = 1,
}

export const EMPLOYEE_STATUS_OPTIONS = [
  { label: 'Đang hoạt động', value: EmployeeStatus.ACTIVE },
  { label: 'Khoá', value: EmployeeStatus.LOCKED },
]

export const TEXT_PARTNER_STATUS = {
  [EmployeeStatus.ACTIVE]: 'Đang hoạt động',
  [EmployeeStatus.LOCKED]: 'Khoá',
};
