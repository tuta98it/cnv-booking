export enum MenuUpgradePartner {
  ContractManagement = 1,
  ListEmployees = 2,
  AccountInfomation = 3,
  BusinessUsageHistory = 4,
}

export const MENU_UPGRADE_PARTNER_OPTION = [
  { label: 'Quản lý hợp đồng', value: MenuUpgradePartner.ContractManagement },
  { label: 'Danh sách nhân viên', value: MenuUpgradePartner.ListEmployees },
  { label: 'Thông tin tài khoản', value: MenuUpgradePartner.AccountInfomation },
  { label: 'Lịch sử sử dụng', value: MenuUpgradePartner.BusinessUsageHistory },
];
