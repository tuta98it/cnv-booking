export enum MenuCreatePartner {
  DebtManagement = 1,
  ListEmployees = 2,
  AccountInfomation = 3,
}

export const MENU_CREATE_PARTNER_OPTION = [
  { label: 'Quản lý hợp đồng', value: MenuCreatePartner.DebtManagement },
  { label: 'Danh sách nhân viên', value: MenuCreatePartner.ListEmployees },
  { label: 'Thông tin tài khoản', value: MenuCreatePartner.AccountInfomation },
];
