export enum UserType {
  SysAdmin = 0,
  Partner = 1,
  StaffVhl = 2,
  User = 3,
  MasterAccount = 4,
  NormalAccount = 5,
  All = 999,
}

export const TEXT_USER_TYPE = {
  [UserType.MasterAccount]: "Master Account",
  [UserType.NormalAccount] : "Normal Account",
}

export const USES_TYPE_OPTIONS = [
  { label: 'Master Account', value: UserType.MasterAccount },
  { label: 'Normal Account', value: UserType.NormalAccount },
]
