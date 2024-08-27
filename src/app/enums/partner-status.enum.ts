export enum PartnerStatus {
  Locked = 0,
  CreatingProfile = 1,
  PendingApproval = 2,
  Active = 3,
}

export const PARTNER_STATUS_OPTIONS = [
  { label: 'Đang tạo hồ sơ', value: PartnerStatus.CreatingProfile },
  { label: 'Chờ phê duyệt', value: PartnerStatus.PendingApproval },
  { label: 'Đang hoạt động', value: PartnerStatus.Active },
  { label: 'Khoá', value: PartnerStatus.Locked },
]

export const TEXT_PARTNER_STATUS = {
  [PartnerStatus.Locked]: 'Khoá',
  [PartnerStatus.CreatingProfile]: 'Đang tạo hồ sơ',
  [PartnerStatus.PendingApproval]: 'Chờ phê duyệt',
  [PartnerStatus.Active]: 'Đang hoạt động',
};
