export enum ActionTypePageVHL {
  View = 1,
  Create = 2,
  Update = 3,
}

export const ActionTypePageText = {
  [ActionTypePageVHL.View] : "Xem thông tin",
  [ActionTypePageVHL.Create] : "Tạo mới",
  [ActionTypePageVHL.Update] : "Cập nhật",
}
