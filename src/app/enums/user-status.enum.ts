export enum UserStatus {
  LOCKED = 0,
  ACTIVE = 1,
}

export const USER_STATUS_OPTIONS = [
  { label: 'Đang hoạt động', value: UserStatus.ACTIVE },
  { label: 'Khoá', value: UserStatus.LOCKED },
]

export const TEXT_USER_STATUS = {
  [UserStatus.ACTIVE]: 'Đang hoạt động',
  [UserStatus.LOCKED]: 'Khoá',
};
