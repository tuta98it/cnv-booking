import { Injectable } from '@angular/core';
import { BaseService } from '../shared/base-service/base-service.service';
import { Observable } from 'rxjs';
import { UrlConstant } from '../shared/constants/url.class';
import { Role } from '../model/role.class';
import { PartnerStatus } from '../enums/partner-status.enum';
import { UserStatus } from 'src/app/enums/user-status.enum';

@Injectable({ providedIn: 'root' })
export class GeneralService extends BaseService {

  // LOGIN
  // Forgot passowrd
  forgotPassword(email: any): any {
    return this.post('/identify', email);
  }

  //phong
  getPhong(): Observable<any[]> {
    return this.get(UrlConstant.LIST_PHONG);
  }
  getChiTietPhong(id: number): Observable<any[]> {
    return this.get(UrlConstant.LIST_PHONG + '/' + id);
  }
  deletePhong(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_PHONG + '/' + id, null);
  }
  addPhong(item: any): any {
    return this.post(UrlConstant.LIST_PHONG, item);
  }
  updatePhong(item: any): any {
    return this.put(UrlConstant.LIST_PHONG + '/' + item.id, item, 'text');
  }

  //loaimon
  getLoaimon(): Observable<any[]> {
    return this.get(UrlConstant.LIST_LOAIMON);
  }
  deleteLoaimon(id: number): Observable<any> {
    return this.delete(UrlConstant.LIST_LOAIMON + '/' + id, null);
  }
  addLoaimon(item: any): any {
    return this.post(UrlConstant.LIST_LOAIMON, item);
  }
  updateLoaimon(item: any): any {
    return this.put(UrlConstant.LIST_LOAIMON + '/' + item.id, item, 'text');
  }

  //monan
  getMonan(): Observable<any[]> {
    return this.get(UrlConstant.LIST_MONAN);
  }
  deleteMonan(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_MONAN + '/' + id, null);
  }
  addMonan(item: any): any {
    return this.post(UrlConstant.LIST_MONAN, item);
  }
  updateMonan(item: any): any {
    return this.put(UrlConstant.LIST_MONAN + '/' + item.id, item, 'text');
  }

  //upload
  upload(FormData: any): Observable<any> {
    return this.post('/file/upload', FormData);
  }
  //donhang
  addDonHang(item: any): any {
    return this.post(UrlConstant.LIST_DONHANG, item);
  }
  deleteDonHang(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_DONHANG + '/' + id, null);
  }
  getChiTietDonhangByGuid(id: any): any {
    return this.get(UrlConstant.LIST_DONHANG + '/GUID/' + id);
  }
  getDonHang(): any {
    return this.get(UrlConstant.LIST_DONHANG);
  }
  changeDonHangStatus(item: any): any {
    return this.post(UrlConstant.LIST_DONHANG + '/ChangeStatus', item);
  }
  updateDonHang(item: any): any {
    return this.put(UrlConstant.LIST_DONHANG + '/' + item.id, item, 'text');
  }
  //Role
  getRole(): Observable<any[]> {
    return this.get(UrlConstant.LIST_ROLE);
  }
  //WorkRole
  getWorkRole(): Observable<any[]> {
    return this.get(UrlConstant.LIST_WORKROLE);
  }
  addWorkRole(item: any): any {
    return this.post(UrlConstant.LIST_WORKROLE, item);
  }
  deleteWorkRole(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_WORKROLE + '/' + id, null);
  }
  updateWorkRole(item: any): any {
    return this.put(UrlConstant.LIST_WORKROLE + '/' + item.id, item, 'text');
  }
  //Group
  getGroup(): Observable<any[]> {
    return this.get(UrlConstant.LIST_NHOMTAIKHOAN);
  }
  deleteGroup(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_NHOMTAIKHOAN + '/' + id, null);
  }
  addGroup(item: any): any {
    return this.post(UrlConstant.LIST_NHOMTAIKHOAN, item);
  }
  updateGroup(item: any): any {
    return this.put(UrlConstant.LIST_NHOMTAIKHOAN + '/' + item.id, item, 'text');
  }
  getGroupOfUser(userId: any): any {
    return this.get(UrlConstant.LIST_NHOMTAIKHOAN + '/GetGroupOfUser/' + userId);
  }


  addUserToGroup(item: any): any {
    return this.post(UrlConstant.LIST_NHOMTAIKHOAN + '/AddUserToGroup', item);
  }
  removeUserFromGroup(item: any): any {
    return this.post(UrlConstant.LIST_NHOMTAIKHOAN + '/RemoveUserFromGroup', item);
  }
  getUserOfGroup(groupId: any): any {
    return this.get(UrlConstant.LIST_USER + '/GetUserOfGroup/' + groupId);
  }

  updateGroupRole(item: any): any {
    return this.post(UrlConstant.LIST_NHOMTAIKHOAN + '/UpdateGroupRoles', item);
  }

  //Staff
  getStaff(): Observable<any[]> {
    return this.get(UrlConstant.LIST_STAFF);
  }
  deleteStaff(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_STAFF + '/' + id, null);
  }
  addStaff(item: any): any {
    return this.post(UrlConstant.LIST_STAFF, item);
  }
  updateStaff(item: any): any {
    return this.put(UrlConstant.LIST_STAFF + '/' + item.id, item, 'text');
  }

  //mineturns
  getMineTurns(): Observable<any[]> {
    return this.get(UrlConstant.LIST_MINETURNS);
  }
  deleteMineTurns(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_MINETURNS + '/' + id, null);
  }
  addMineTurns(item: any): any {
    return this.post(UrlConstant.LIST_MINETURNS, item);
  }
  updateMineTurns(item: any): any {
    return this.put(UrlConstant.LIST_MINETURNS + '/' + item.id, item, 'text');
  }
  getMineTurnsStaff(mineturnId: number): Observable<any[]> {
    return this.get(UrlConstant.LIST_MINETURNS + '/GetMineTurnsStaff/' + mineturnId);
  }
  saveMineTurnsStaff(mineturnId: number): Observable<any[]> {
    return this.get(UrlConstant.LIST_MINETURNS + '/SaveMineTurnsStaff/' + mineturnId);
  }
  duyetMineTurns(item: any): any {
    return this.put(UrlConstant.LIST_MINETURNS + '/DuyetMineTurns/' + item.id, item);
  }
  yeuCauDuyetMineTurns(item: any): any {
    return this.put(UrlConstant.LIST_MINETURNS + '/YeuCauDuyetMineTurns/' + item.id, item);
  }
  thucHienNo(item: any): any {
    return this.put(UrlConstant.LIST_MINETURNS + '/ThucHienNo/' + item.id, item);
  }

  //mineturns staff
  addMineTurnsStaff(item: any): any {
    return this.post(UrlConstant.LIST_MINETURNSSTAFF, item);
  }
  deleteMineTurnsStaff(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_MINETURNSSTAFF + '/' + id, null);
  }
  //turnsStatus
  getTurnsStatus(): Observable<any[]> {
    return this.get(UrlConstant.LIST_TURNSSTATUS);
  }

  //Kho
  getKho(): Observable<any[]> {
    return this.get(UrlConstant.LIST_KHO);
  }
  deleteKho(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_KHO + '/' + id, null);
  }
  addKho(item: any): any {
    return this.post(UrlConstant.LIST_KHO, item);
  }
  updateKho(item: any): any {
    return this.put(UrlConstant.LIST_KHO + '/' + item.id, item, 'text');
  }
  saveWarehouseStaff(warehouseId: number, item: any): any {
    return this.post(UrlConstant.LIST_KHO + '/SaveWarehouseStaff/' + warehouseId, item, 'text');
  }

  //Dmthietbi
  getDmthietbi(): Observable<any[]> {
    return this.get(UrlConstant.LIST_DMTHIETBI);
  }
  deleteDmthietbi(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_DMTHIETBI + '/' + id, null);
  }
  addDmthietbi(item: any): any {
    return this.post(UrlConstant.LIST_DMTHIETBI, item);
  }
  updateDmthietbi(item: any): any {
    return this.put(UrlConstant.LIST_DMTHIETBI + '/' + item.id, item, 'text');
  }
  //Thietbi
  getThietbi(): Observable<any[]> {
    return this.get(UrlConstant.LIST_THIETBI);
  }
  deleteThietbi(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_THIETBI + '/' + id, null);
  }
  addThietbi(item: any): any {
    return this.post(UrlConstant.LIST_THIETBI, item);
  }
  updateThietbi(item: any): any {
    return this.put(UrlConstant.LIST_THIETBI + '/' + item.id, item, 'text');
  }

  //Danh muc hang hoa
  getDmHangHoa(): Observable<any[]> {
    return this.get(UrlConstant.LIST_DM_HANGHOA);
  }
  deleteDmHangHoa(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_DM_HANGHOA + '/' + id, null);
  }
  addDmHangHoa(item: any): any {
    return this.post(UrlConstant.LIST_DM_HANGHOA, item);
  }
  updateDmHangHoa(item: any): any {
    return this.put(UrlConstant.LIST_DM_HANGHOA + '/' + item.id, item, 'text');
  }

  //Hang hoa
  getHangHoa(): Observable<any[]> {
    return this.get(UrlConstant.LIST_HANGHOA);
  }
  deleteHangHoa(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_HANGHOA + '/' + id, null);
  }
  addHangHoa(item: any): any {
    return this.post(UrlConstant.LIST_HANGHOA, item);
  }
  updateHangHoa(item: any): any {
    return this.put(UrlConstant.LIST_HANGHOA + '/' + item.id, item, 'text');
  }

  ///Login/GetInitialData
  getInitialData(): any {
    return this.get('/Login/GetInitialData');
  }
  getSystemConfig(): any {
    return this.get('/SystemConfig');
  }
  updateSystemConfig(item: any): any {
    return this.put('/SystemConfig/' + item.id, item, 'text');
  }
  getMineturnsConfig(): any {
    return this.get('/MineturnsConfigs');
  }
  updateMineturnsConfig(item: any): any {
    return this.put('/MineturnsConfigs/' + item.id, item, 'text');
  }

  //tonkho
  getTonKho(search: any): Observable<any[]> {
    return this.post(UrlConstant.LIST_TONKHO + '/GetAll', search);
  }
  addTonKho(item: any): any {
    return this.post(UrlConstant.LIST_TONKHO, item);
  }
  deleteTonKho(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_TONKHO + '/' + id, null);
  }
  getViewWarehouse(): any {
    return this.get(UrlConstant.LIST_TONKHO + '/GetViewWarehouse');
  }
  getAddWarehouse(): any {
    return this.get(UrlConstant.LIST_TONKHO + '/GetAddWarehouse');
  }


  //nhapkho
  getPhieuNhapKho(search: any): Observable<any[]> {
    return this.post(UrlConstant.LIST_PHIEU_NHAPKHO + '/GetAll', search);
  }
  addPhieuNhapKho(item: any): any {
    return this.post(UrlConstant.LIST_PHIEU_NHAPKHO, item);
  }
  deletePhieuNhapKho(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_PHIEU_NHAPKHO + '/' + id, null);
  }
  updatePhieuNhapKho(item: any): any {
    return this.put(UrlConstant.LIST_PHIEU_NHAPKHO + '/' + item.id, item);
  }
  approvePhieuNhapKho(item: any): any {
    return this.put(UrlConstant.LIST_PHIEU_NHAPKHO + '/duyet/' + item.id, null);
  }
  GetImportRelatedWarehouse(): any {
    return this.get(UrlConstant.LIST_PHIEU_NHAPKHO + '/GetRelatedWarehouse');
  }


  //xuatkho
  getPhieuXuatKho(search: any): Observable<any[]> {
    return this.post(UrlConstant.LIST_PHIEU_XUATKHO + '/GetAll', search);
  }
  addPhieuXuatKho(item: any): any {
    return this.post(UrlConstant.LIST_PHIEU_XUATKHO, item);
  }
  deletePhieuXuatKho(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_PHIEU_XUATKHO + '/' + id, null);
  }
  updatePhieuXuatKho(item: any): any {
    return this.put(UrlConstant.LIST_PHIEU_XUATKHO + '/' + item.id, item);
  }
  approvePhieuXuatKho(item: any): any {
    return this.put(UrlConstant.LIST_PHIEU_XUATKHO + '/duyet/' + item.id, null);
  }
  getExportRelatedWarehouse(): any {
    return this.get(UrlConstant.LIST_PHIEU_XUATKHO + '/GetRelatedWarehouse');
  }
  //ton kho dau ky
  getPhieuTonKho(search: any): Observable<any[]> {
    return this.post(UrlConstant.LIST_WAREHOUSE_FIRST_IMPORT + '/GetAll', search);
  }
  addPhieuTonKho(item: any): any {
    return this.post(UrlConstant.LIST_WAREHOUSE_FIRST_IMPORT, item);
  }
  deletePhieuTonKho(id: number): Observable<number> {
    return this.delete(UrlConstant.LIST_WAREHOUSE_FIRST_IMPORT + '/' + id, null);
  }
  updatePhieuTonKho(item: any): any {
    return this.put(UrlConstant.LIST_WAREHOUSE_FIRST_IMPORT + '/' + item.id, item);
  }
  getFirstImportRelatedWarehouse(): any {
    return this.get(UrlConstant.LIST_WAREHOUSE_FIRST_IMPORT + '/GetRelatedWarehouse');
  }
  uploadTonKho(FormData): Observable<any> {
    return this.post(UrlConstant.FILE + '/UploadFirstImport', FormData);
  }
  //ca lam viec
  getCalamviec(search: any): Observable<any[]> {
    return this.post(UrlConstant.LIST_CALAMVIEC + '/GetAll', search);
  }
  getNhanSuCalamviec(): Observable<any[]> {
    return this.get(UrlConstant.LIST_CALAMVIEC + '/GetListStaff');
  }
  getChitietCalamviec(id): Observable<any[]> {
    return this.get(UrlConstant.LIST_CALAMVIEC + '/WorkShift/' + id);
  }
  updateCalamviec(item: any): any {
    return this.put(UrlConstant.LIST_CALAMVIEC + '/' + item.id, item);
  }
  deleteCalamviec(id: number): any {
    return this.delete(UrlConstant.LIST_CALAMVIEC + '/' + id, null);
  }
  updateWithRecurrent(item: any): any {
    return this.put(UrlConstant.LIST_CALAMVIEC + '/UpdateWithRecurrent/' + item.id, item, 'text');
  }
  addCalamviec(item: any): any {
    return this.post(UrlConstant.LIST_CALAMVIEC, item);
  }

  getTinhThanh(parentId): Observable<any[]> {
    const payload = {
      parentId
    };
    return this.post('/Tinhthanh/GetTinhthanh', payload);
  }

  //==============================================
  //taikhoan
  getTaikhoan(): Observable<any[]> {
    return this.get(UrlConstant.LIST_TAIKHOAN);
  }
  getTaikhoanById(id): Observable<any> {
    return this.get(UrlConstant.LIST_TAIKHOAN + '/' + id);
  }
  deleteTaikhoan(id: number): Observable<any> {
    return this.delete(UrlConstant.LIST_TAIKHOAN + '/' + id, null);
  }
  setStatusUser(idUser: number, newStatus: boolean): Observable<any> {
    return this.put(`${UrlConstant.LIST_TAIKHOAN}/SetStatusUser/${idUser}?isActive=${newStatus}`, '');
  }
  addTaikhoan(item: any): any {
    return this.post(UrlConstant.LIST_TAIKHOAN, item);
  }
  updateTaikhoan(item: any): any {
    return this.put(UrlConstant.LIST_TAIKHOAN + '/' + item.id, item, 'text');
  }
  updateUserPassword(item: any): any {
    return this.post(UrlConstant.LIST_TAIKHOAN + '/ChangeUserPassword/' + item.id, item);
  }
  addGroup2User(item: any): any {
    return this.post(UrlConstant.LIST_TAIKHOAN + '/AddGroup2User', item);
  }

  //User
  putUser2Partner(payload: any): Observable<any> {
    return this.put(
      UrlConstant.LIST_USER + `/PutUser2Partner/${payload.userId}`,
      payload
    );
  }

  addUser(newData: any): Observable<any> {
    return this.post(UrlConstant.LIST_USER, newData);
  }


  deleteUserByID(idUser: any): Observable<any> {
    return this.delete(UrlConstant.LIST_USER + `/${idUser}`, idUser);
  }


  updateUser(newData: any): Observable<any> {
    return this.put(UrlConstant.LIST_USER + `/${newData.id}`, newData);
  }

  postAccountForPartner(data: any): Observable<any> {
    return this.post(UrlConstant.LIST_USER + '/PostAccountForPartner', data);
  }


  queryByUserType(userTypeRequest: any): Observable<any> {
    return this.post(UrlConstant.LIST_USER + `/QueryByUserType`, userTypeRequest);
  }


  getListAdminEmployees(): Observable<any> {
    return this.get(UrlConstant.LIST_USER + `/GetListAdminEmployees`);
  }


  getUserForSysAdmin(): Observable<any> {
    return this.get(UrlConstant.LIST_USER + '/GetUserForSysAdmin/');
  }

  getUserById(userId: number): Observable<any> {
    return this.get(`${UrlConstant.LIST_USER}/${userId}`);
  }

  getUsersByPartnerId(partnerId: number): Observable<any> {
    return this.get(UrlConstant.LIST_USER + `/GetByPartnerId/${partnerId}`);
  }



  // putAccountForPartner(id: any, newData: any) {
  //   return this.put(UrlConstant.LIST_USER + `/PutAccountForPartner/${id}`, newData);
  // }


  changeUserPassword(id: any, newPass: any): Observable<any> {
    return this.post(UrlConstant.LIST_USER + `/ChangeUserPassword/${id}`, newPass);
  }

  upgradeEmployeeForPartner(newEmployee: any): Observable<any> {
    return this.post(UrlConstant.LIST_USER + `/AddOrUpdateEmployeeForPartner`, newEmployee);
  }


  createEmployeeBaseInfoForPartner(newEmployee: any): Observable<any> {
    return this.post(UrlConstant.LIST_USER + `/CreateBaseInfoForPartner`, newEmployee);
  }


  updateEmployeeBaseInfoForPartnerById(employeeId: number, updateEmployee: any): Observable<any> {
    return this.put(UrlConstant.LIST_USER + `/UpdateBaseInfoForPartnerById/${employeeId}`, updateEmployee);
  }


  downloadExcelEmployeeForPartner(partnerId: number): Observable<any> {
    return this.post(UrlConstant.LIST_USER + `/DownloadExcelEmployeeForPartner`, { "partnerId": partnerId }, {}, "blob");
  }

  changeStatusUserById(partnerId: number, newStatus: UserStatus): Observable<any> {
    return this.put(UrlConstant.LIST_USER + `/ChangeStatus/${partnerId}?newStatus=${newStatus}`, newStatus);
  }

  //Partners
  getListPartner(): Observable<any[]> {
    return this.get(UrlConstant.LIST_PARTNERS);
  }

  getPartnerById(partnerId: number): Observable<any[]> {
    return this.get(`${UrlConstant.LIST_PARTNERS}/${partnerId}`);
  }
  // getListPartner(): Observable<any[]> {
  //   return this.get(UrlConstant.LIST_PARTNERS + "/GetPartnerForAcc");
  // }

  getListPartnerNew(): Observable<any[]> {
    return this.get(UrlConstant.LIST_PARTNERS + "/GetPartnerForSelect");
  }

  getListRootPartner(): Observable<any[]> {
    return this.get(UrlConstant.LIST_PARTNERS + "/GetRootPartnes");
  }

  getAddPartner(item: any): any {
    return this.post(UrlConstant.LIST_PARTNERS, item);
  }

  addPartnerAccount(item: any): any {
    return this.post(UrlConstant.LIST_ACCOUNTP, item);
  }

  getUpdatePartner(item: any): any {
    return this.put(UrlConstant.LIST_PARTNERS + "/" + item.id, item);
  }

  deletePartner(idPartner: number): any {
    return this.delete(UrlConstant.LIST_PARTNERS + "/" + idPartner, idPartner);
  }

  savePartnerRate(item: any): any {
    return this.post(UrlConstant.LIST_PARTNERS + "/SavePartnerRate", item);
  }

  deletePartnerRate(id): any {
    return this.delete(
      UrlConstant.LIST_PARTNERS + "/DeletePartnerRate/" + id,
      null
    );
  }

  disablePartner(id: any): any {
    return this.post(UrlConstant.LIST_PARTNERS + "/DisablePartner/" + id, null);
  }


  addBaseInfoPartner(newData: any): Observable<any> {
    return this.post(`${UrlConstant.LIST_PARTNERS}/CreateBaseInfo`, newData);
  }

  updateBaseInfoById(updateData: any, idPartner: number): Observable<any> {
    return this.put(`${UrlConstant.LIST_PARTNERS}/UpdateBaseInfoById/${idPartner}`, updateData);
  }


  updateBaseInfoPartner(upData: any): Observable<any> {
    return this.put(`${UrlConstant.LIST_PARTNERS}/UpdateBaseInfo`, upData);
  }
  updateContractInfoForPartner(idPartner: number, updateData: any): Observable<any> {
    return this.put(`${UrlConstant.LIST_PARTNERS}/UpdateContractInfo/${idPartner}`, updateData);
  }


  updatePartner(newData: any): Observable<any> {
    return this.put(UrlConstant.LIST_PARTNERS + `/${newData.id}`, newData);
  }

  resetDebtForPartnerByID(idPartner: any): Observable<any> {
    return this.post(UrlConstant.LIST_PARTNERS + `/ResetDebt/${idPartner}`, idPartner);
  }


  accountBalanceInformationByPartner(partnerId: number): Observable<any> {
    return this.post(UrlConstant.LIST_PARTNERS + `/AccountBalanceInformationByPartner`, { PartnerId: partnerId });
  }


  sendApprovalRequest(partnerId: number): Observable<any> {
    return this.post(UrlConstant.LIST_PARTNERS + `/SendApprovalRequest`, { partnerId: partnerId });
  }


  submitRequestForApprovalConfirmation(partnerId: number): Observable<any> {
    return this.post(UrlConstant.LIST_PARTNERS + `/SubmitRequestForApprovalConfirmation`, { partnerId: partnerId });
  }

  changeStatusPartnerById(partnerId: number, newStatus: PartnerStatus): Observable<any> {
    return this.put(UrlConstant.LIST_PARTNERS + `/ChangeStatus/${partnerId}?newStatus=${newStatus}`, newStatus);
  }



  // Booking

  // Xuất vé
  getMyTicket(payload: any): any {
    return this.post('/api' + `${UrlConstant.BOOKING}` + '/myticket', payload);
  }

  // Tài khoản đăng kí
  getUserRegister(): any {
    return this.get(UrlConstant.USER_REGISTER);
  }

  updateUserRegister(item: any): any {
    return this.put(UrlConstant.USER_REGISTER + '/' + item.id, item, 'text');
  }

  // /api/Booking/adminhistorybooking Quản lý giữ vé
  getAdminHistoryBooking(payload: any): any {
    return this.post('/api' + `${UrlConstant.BOOKING}` + '/adminhistorybooking', payload);
  }

  // Xuất vé - Admin
  getAdminTicket(payload: any): any {
    return this.post('/api' + `${UrlConstant.BOOKING}` + '/adminticket', payload);
  }


  // Huỷ vé - Admin
  getAdminVoidTicket(payload: any): any {
    return this.post('/api' + `${UrlConstant.BOOKING}` + '/adminvoidticket', payload);
  }


  ReportDebtStatistics(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING}/ReportDebtStatistics`, payload);
  }

  // BookingV2
  adminRequestBooking(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKINGV2}/adminRequestBooking`, payload);
  }

  updateRequestBooking(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKINGV2}/UpdateRequestBooking`, payload);
  }

  updateStatusRequestBooking(requestBookingId: number, status: number): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKINGV2}/UpdateStatusRequestBooking`, { requestBookingId: requestBookingId, status: status });
  }


  getListBusinessServiceUsageHistory(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKINGV2}/GetListBusinessServiceUsageHistory`, payload);
  }

  getListEmployeeServiceUsageHistoryAdmin(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKINGV2}/GetListEmployeeServiceUsageHistoryAdmin`, payload);
  }


  // RequestBooking
  getRequestBookingByID(id: number): Observable<any> {
    return this.get(`/api${UrlConstant.REQUEST_BOOKING}/GetRequestBookingByID/${id}`);
  }

  getHistoriesByRequestBookingId(id: number): Observable<any> {
    return this.get(`/api${UrlConstant.REQUEST_BOOKING}/GetHistoriesByRequestBookingId/${id}`);
  }

  updatePassengerRequestBookings(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.REQUEST_BOOKING}/UpdatePassengerRequestBookings`, payload);
  }

  //BOOKING
  getBookingByID(idBooking: any): Observable<any> {
    return this.get(`/api${UrlConstant.BOOKING}/getbookingbyid/${idBooking}`);
  }


  markCanceledSystemTicketFlightExport(idTicket: any, payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING}/MarkCanceled/${idTicket}`, payload);
  }


  salesReport(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING}/BaoCaoDoanhSo`, payload);
  }


  salesReportByDay(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING}/BaoCaoDoanhSoTheoNgay`, payload);
  }



  //TestResult
  updateTestResult(item: any): any {
    return this.put(UrlConstant.LIST_TEST_RESULT + "/" + item.id, item);
  }

  approveTestResult(item: any): any {
    return this.put(UrlConstant.LIST_TEST_RESULT + "/Approve/" + item.id, item);
  }

  cancelTestResult(item: any): any {
    return this.put(UrlConstant.LIST_TEST_RESULT + "/Cancel/" + item.id, item);
  }

  updateResultValue(payload): any {
    return this.post(UrlConstant.LIST_TEST_RESULT + "/Save", payload);
  }

  updateMultiResultValue(payload): any {
    return this.post(UrlConstant.LIST_TEST_RESULT + "/SaveAll", payload);
  }

  updateResultNote(payload): any {
    return this.post(UrlConstant.LIST_TEST_RESULT + "/SaveNoteResult", payload);
  }

  saveFile(payload): any {
    return this.post(UrlConstant.LIST_TEST_RESULT + "/SaveFile", payload);
  }

  removeFilePartner(id): any {
    return this.delete(`/Partners/RemoveFile/${id}`, id);
  }


  // Hotel
  getHotels(): Observable<any> {
    return this.get(`/api${UrlConstant.HOTEL}`);
  }
  getHotelById(hotelId): Observable<any> {
    return this.get(`/api/Hotel/GetHotelV2/${hotelId}`);
  }
  addHotel(hotel: any): any {
    return this.post(`/api${UrlConstant.HOTEL}`, hotel);
  }
  filterHotel(payload: any): any {
    return this.post(`/api/Hotel/GetV2HotelFilter`, payload);
  }
  updateHotelByID(idHotel: any, hotel: any): Observable<any> {
    return this.put(`/api${UrlConstant.HOTEL}/${idHotel}`, hotel);
  }
  saveHotelContract(hotel: any): Observable<any> {
    return this.put(`/api/Hotel/UpdateHotelContract/${hotel.id}`, hotel);
  }
  deleteHotelByID(idHotel: any): Observable<any> {
    return this.delete(`/api${UrlConstant.HOTEL}/${idHotel}`, idHotel);
  }
  getRoomHotels(hotelId: any): any {
    return this.get(`/api/Hotel/GetRoomHotel/${hotelId}`);
  }
  getRoomById(roomId: any): any {
    return this.get(`/api/Room/${roomId}`);
  }

  deleteHotelImageByID(idImage: any): Observable<any> {
    return this.delete(`/api${UrlConstant.HOTEL}/DeleteHotelFile/${idImage}`, idImage);
  }

  getHotelTransactionHistory(payload): Observable<any> {
    return this.post(`/api/Hotel/GetHotelTransactionHistory`, payload);
  }
  // setActiveHotel/{id}
  setActiveHotel(idHotel: number, isActive: boolean): Observable<any> {
    return this.put(`/api${UrlConstant.HOTEL}/SetActiveHotel/${idHotel}?isActive=${isActive}`, '');
  }

  doPayMoneyForHotel(payload): Observable<any> {
    return this.post(`/api/Hotel/PayMoneyForHotel`, payload);
  }

  // BookingHotel
  getAdminBookingHotels(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING_HOTEL}/adminhistorybookinghotel`, payload);
  }

  confirmBooking(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING_HOTEL}/confirmBooking`, payload);
  }

  refuseBooking(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING_HOTEL}/refuseBooking`, payload);
  }


  reportHotelDebtStatistics(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING_HOTEL}/ReportHotelDebtStatistics`, payload);
  }

  getBookingHotelById(idBoooking: any): Observable<any> {
    return this.get(`/api${UrlConstant.BOOKING_HOTEL}/GetBookingHotelById/${idBoooking}`);
  }

  markCanceledSystemBookingHotelExport(idBookingHotel: any, nodeSystemCancelled: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING_HOTEL}/MarkCanceled/${idBookingHotel}`, nodeSystemCancelled);
  }
  updateBookingHotelStatus(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.BOOKING_HOTEL}/UpdateBookingHotelStatus`, payload);
  }
  updateBookingHotel(payload: any): Observable<any> {
    return this.put(`/api${UrlConstant.BOOKING_HOTEL}/UpdateBookHotel`, payload);
  }

  getGetChangeStatusHistory(id: number): Observable<any> {
    return this.get(`/api${UrlConstant.BOOKING_HOTEL}/GetChangeStatusHistory/${id}`);
  }

  // Email
  // /api/Email/SendEmailConfirmedBookingHotel
  sendEmailConfirmedBookingHotel(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.EMAIL}/sendEmailConfirmedBookingHotel`, payload);
  }

  sendEmailToPassengerToConfirmFlightTicket(requestBookingId: number): Observable<any> {
    return this.post(`/api${UrlConstant.EMAIL}/sendEmailToPassengerToConfirmFlightTicket`, { requestBookingId: requestBookingId });
  }

  sendEmailToAdminVHLNotifyFlightTicketConfirmed(requestBookingId: number): Observable<any> {
    return this.post(`/api${UrlConstant.EMAIL}/SendEmailToAdminVHLNotifyFlightTicketConfirmed`, { requestBookingId: requestBookingId });
  }

  sendEmailToPassengerToConfirmSuccessIssuedTicket(requestBookingId: number): Observable<any> {
    return this.post(`/api${UrlConstant.EMAIL}/SendEmailToPassengerToConfirmSuccessIssuedTicket`, { requestBookingId: requestBookingId });
  }

  // News
  getNews(): Observable<any> {
    return this.get(`/api${UrlConstant.NEWS}`);
  }

  addNews(News: any): Observable<any> {
    return this.post(`/api${UrlConstant.NEWS}`, News);
  }

  updateNewsByID(idNews: any, News: any): Observable<any> {
    return this.put(`/api${UrlConstant.NEWS}/${idNews}`, News);
  }

  deleteNewsByID(idNews: any): Observable<any> {
    return this.delete(`/api${UrlConstant.NEWS}/${idNews}`, idNews);
  }




  // Utility
  private getListUtilityByType(utilityType: any): Observable<any> {
    return this.get(`/api${UrlConstant.UTILITY}/GetByType/${utilityType}`);
  }


  getAllUtility(): Observable<any> {
    return this.get(`/api${UrlConstant.UTILITY}`);
  }

  getListUtilityHotel(): Observable<any> {
    // return this.get(`/api${UrlConstant.UTILITY}/1`);
    return this.getListUtilityByType(1);
  }


  getListUtilityRoom(): Observable<any> {
    // return this.get(`/api${UrlConstant.UTILITY}/2`);
    return this.getListUtilityByType(2);
  }


  addUtilityRoom(nameUtilityRoom: any): Observable<any> {
    const payload = {
      id: 0,
      type: 2,
      name: nameUtilityRoom
    }
    return this.post(`/api${UrlConstant.UTILITY}`, payload);
  }

  addUtilityHotel(nameUtilityHotel: any): Observable<any> {
    const payload = {
      id: 0,
      type: 1,
      name: nameUtilityHotel
    }
    return this.post(`/api${UrlConstant.UTILITY}`, payload);
  }

  updateUtilityByID(idUtility: any, utility: any): Observable<any> {
    return this.put(`/api${UrlConstant.UTILITY}/${idUtility}`, utility);
  }

  deleteUtilityByID(idUtility: any): Observable<any> {
    return this.delete(`/api${UrlConstant.UTILITY}/${idUtility}`, idUtility);
  }

  // Rooms
  getRooms(): Observable<any> {
    return this.get(`/api${UrlConstant.ROOM}`);
  }

  addRoom(room: any): Observable<any> {
    return this.post(`/api${UrlConstant.ROOM}`, room);
  }

  updateRoomByID(idRoom: any, room: any): Observable<any> {
    return this.put(`/api${UrlConstant.ROOM}/${idRoom}`, room);
  }

  deleteRoomByID(idRoom: any): Observable<any> {
    return this.delete(`/api${UrlConstant.ROOM}/${idRoom}`, idRoom);
  }

  deleteRoomImageByID(idImage: any): Observable<any> {
    return this.delete(`/api${UrlConstant.ROOM}/DeleteRoomFile/${idImage}`, idImage);
  }

  SetAvailableRoom(obdjIsAvaliable: any): Observable<any> {
    return this.post(`/api${UrlConstant.ROOM}/SetAvailable`, obdjIsAvaliable);
  }

  setActiveRoom(room: any): Observable<any> {
    return this.post(`/api/Room/SetActive`, room);
  }

  getProvinces(): Observable<any[]> {
    return this.get(`/api/Province`);
  }

  getDistricsByProvinces(idProvince: number): Observable<any[]> {
    return this.get(`/api/Province/${idProvince}`);
  }


  createRoomPriceDetail(newItemPriceDetail: any): Observable<any> {
    if (newItemPriceDetail.id === 0) {
      return this.post(`/api${UrlConstant.ROOM}/UpdateRoomPriceDetail`, newItemPriceDetail);
    }
  }

  updateRoomPriceDetailByID(editItemPriceDetail: any): Observable<any> {
    if (editItemPriceDetail.id !== 0) {
      return this.post(`/api${UrlConstant.ROOM}/UpdateRoomPriceDetail`, editItemPriceDetail);
    }
  }

  deleteRequestBookingFileByID(idFile: any): Observable<any> {
    return this.delete(`${UrlConstant.UPLOAD}/DeleteRequestBookingFile/${idFile}`, idFile);
  }


  removeRoomPriceDetail(idItemPriceDetail: any): Observable<any> {
    return this.post(`/api${UrlConstant.ROOM}/RemoveRoomPriceDetail/${idItemPriceDetail}`, idItemPriceDetail);
  }

  // Airport
  getAirport(): Observable<any> {
    return this.get(`/api${UrlConstant.AIRPORT}`);
  }

  getAirportByID(idAirport: any): Observable<any> {
    return this.get(`/api${UrlConstant.AIRPORT}/${idAirport}`);
  }

  addAirport(Airport: any): Observable<any> {
    return this.post(`/api${UrlConstant.AIRPORT}`, Airport);
  }

  updateAirportByID(idAirport: any, Airport: any): Observable<any> {
    return this.put(`/api${UrlConstant.AIRPORT}/${idAirport}`, Airport);
  }

  depositAccount(payloadDeposit: any): Observable<any> {
    return this.post(`/api${UrlConstant.ACCOUNT_DEPOSIT_HISTORIES}/DepositAccount`, payloadDeposit);
  }
}
