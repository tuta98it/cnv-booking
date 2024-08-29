export enum MenuUpgradePartner {
  ContractManagement = 1,
  ListEmployees = 2,
  AccountInfomation = 3,
}

export const MENU_UPGRADE_PARTNER_OPTION = [
  { label: 'Quản lý hợp đồng', value: MenuUpgradePartner.ContractManagement },
  { label: 'Danh sách nhân viên', value: MenuUpgradePartner.ListEmployees },
  { label: 'Thông tin tài khoản', value: MenuUpgradePartner.AccountInfomation },
];
