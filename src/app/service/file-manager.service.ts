import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {UrlConstant} from '../shared/constants/url.class';
import {Action} from '../model/action.model';

@Injectable()
export class FileManagerService extends BaseService {
  getLogs(): Observable<any[]> {
    const payload = {page: 1, pageSize: 1000};
    return this.post('/api/SMS/GetLogSms?page=1&pageSize=50', payload);
  }

  getBucketById(id): Observable<any> {
    return this.get(`/Bucket/ById?id=${id}`);
  }

  addBucket(item: any): any {
    return this.post('/bucket', item);
  }

  updateBucket(item: any): any {
    return this.put('/bucket', item);
  }

  getStorage(): Observable<any[]> {
    return this.get('/storage');
  }

  addStorage(item: any): any {
    return this.post('/storage', item);
  }

  updateStorage(item: any): any {
    return this.put('/storage', item);
  }

  updateLog(): Observable<any> {
    return this.get(`/api/SMS/UpdateStatusSms`);
  }

  sendSMS(item: any): any {
    return this.post('/api/SMS/SendSms', item);
  }

  /* TELCO */
  getTelco(): Observable<any[]> {
    return this.get('/api/Telco');
  }

  addTelco(item: any): any {
    return this.post('/api/Telco', item);
  }

  updateTelco(item: any): any {
    return this.put(`/api/Telco/${item.id}`, item);
  }

  deleteTelco(id: any): any {
    return this.delete(`/api/Telco/${id}`, null);
  }

  /* Device */
  getDevice(): Observable<any[]> {
    return this.get('/api/Device');
  }

  addDevice(item: any): any {
    return this.post('/api/Device', item);
  }

  updateDevice(item: any): any {
    return this.put(`/api/Device/${item.id}`, item);
  }

  deleteDevice(item: any): any {
    return this.delete(`/api/Device/${item.id}`, null);
  }

  /* Group contact */
  getContactGroup(): Observable<any[]> {
    return this.get('/api/ContactGroup');
  }

  addContactGroup(item: any): any {
    return this.post('/api/ContactGroup', item);
  }

  updateContactGroup(item: any): any {
    return this.put(`/api/ContactGroup/${item.id}`, item);
  }

  deleteContactGroup(id: any): any {
    return this.delete(`/api/ContactGroup/${id}`, null);
  }

  getContactGroupAssignment(item: any): any {
    return this.post('/api/ContactGroup/GetContactGroupAssignment', item);
  }

  saveContactGroupAssignment(item: any): any {
    return this.post('/api/ContactGroup/SaveContactGroupAssignment', item);
  }

  /* contact aves */
  getContact(payload): Observable<any> {
    return this.post('/api/Contact/GetContact', payload);
  }

  addContact(item: any): any {
    return this.post('/api/Contact', item);
  }

  updateContact(item: any): any {
    return this.put(`/api/Contact/${item.id}`, item);
  }

  deleteContact(id: any): any {
    return this.delete(`/api/Contact/${id}`, null);
  }

  /* Label */
  getLabel(): Observable<any[]> {
    return this.get('/api/Label');
  }

  addLabel(item: any): any {
    return this.post('/api/Label', item);
  }

  updateLabel(item: any): any {
    return this.put(`/api/Label/${item.id}`, item);
  }

  deleteLabel(id: any): any {
    return this.delete(`/api/Label/${id}`, null);
  }

  /* System manager_Account mannager */
  getUser(): Observable<any[]> {
    return this.get('/api/User');
  }

  getUserById(id): Observable<any> {
    return this.get(`/api/User/${id}`);
  }

  getGroupByUser(id): Observable<any> {
    return this.get(`/api/User/GetGroupByUser/${id}`);
  }

  addUser(item: any): any {
    return this.post('/User', item);
  }

  updateUser(item: any): any {
    return this.put(`/User/${item.id}`, item);
  }

  deleteUser(id: any): any {
    return this.delete(`/User/${id}`, null);
  }

  resetPassword(item: any): any {
    return this.post(`/api/User/ChangeUserPassword/${item.id}`, item);
  }

  changePassword(item: any): any {
    return this.post(`/User/ChangePassword`, item);
  }

  /* System manager_IP Address Manager */
  getIpaddress(): Observable<any[]> {
    return this.get('/api/Ipaddress');
  }

  addIpaddress(item: any): any {
    return this.post('/api/Ipaddress', item);
  }

  updateIpaddress(item: any): any {
    return this.put(`/api/Ipaddress/${item.id}`, item);
  }

  deleteIpaddress(id: any): any {
    return this.delete(`/api/Ipaddress/${id}`, null);
  }

  /* System manager_Group Permission */
  getGroup(): Observable<any[]> {
    return this.get('/api/Group');
  }

  addGroup(item: any): any {
    return this.post('/api/Group', item);
  }

  updateGroup(item: any): any {
    return this.put(`/api/Group/${item.id}`, item);
  }

  deleteGroup(id: any): any {
    return this.delete(`/api/Group/${id}`, null);
  }

  addUser2Group(item: any): any {
    return this.post('/api/Group/AddUser2Group', item);
  }

  getUserOfGroup(groupId): Observable<any> {
    return this.get(`/api/User/GetUserOfGroup/${groupId}`);
  }

  removeUserFromGroup(item: any): any {
    return this.post('/api/Group/RemoveUserFromGroup', item);
  }

  /* Contact Manager_Other Contacts */
  getOtherContact(): Observable<any[]> {
    return this.get('/api/OtherContact');
  }

  addOtherContact(item: any): any {
    return this.post('/api/OtherContact', item);
  }

  updateOtherContact(item: any): any {
    return this.put(`/api/OtherContact/${item.id}`, item);
  }

  deleteOtherContact(id: any): any {
    return this.delete(`/api/OtherContact/${id}`, null);
  }

  /* Contact Groups manager_Vip Group */
  getVipGroup(): Observable<any[]> {
    return this.get('/api/VipGroup');
  }

  addVipGroup(item: any): any {
    return this.post('/api/VipGroup', item);
  }

  updateVipGroup(item: any): any {
    return this.put(`/api/VipGroup/${item.id}`, item);
  }

  deleteVipGroup(id: any): any {
    return this.delete(`/api/VipGroup/${id}`, null);
  }

  getVipGroupAssignment(item: any): any {
    return this.post('/api/VipGroup/GetVipGroupAssignment', item);
  }

  saveVipGroupAssignment(item: any): any {
    return this.post('/api/VipGroup/SaveVipGroupAssignment', item);
  }

  /* Message */
  getInbox(item: any): any {
    return this.post('/api/Message/Inbox', item);
  }

  getOutbox(item: any): any {
    return this.post('/api/Message/Outbox', item);
  }

  getOutboxAves(item: any): any {
    return this.post('/api/Message/OutboxAves', item);
  }

  getPending(item: any): any {
    return this.post('/api/Message/Pending', item);
  }

  getTrash(item: any): any {
    return this.post('/api/Message/Deleted', item);
  }

  getSpam(item: any): any {
    return this.post('/api/Message/Spam', item);
  }

  getInboxByLabel(item: any): any {
    return this.post('/api/Message/GetInboxByLabel', item);
  }

  addMessageOutbox(item: any): any {
    return this.post('/api/Message/Outbox', item);
  }

  addMessageContactFilter(item: any): any {
    return this.post('/api/Message/ContactFilter', item);
  }

  sendMessageViaContact(item: any): any {
    return this.post('/api/Message/SendMessageViaContact', item);
  }

  sendMessageViaPhone(item: any): any {
    return this.post('/api/Message/SendMessageViaPhone', item);
  }

  reSendMessage(messageIds: any[]): any {
    const item = {
      ids: messageIds
    };
    return this.post(`/api/Message/ReSend/${messageIds[0]}`, item);
  }

  spamMessage(messageIds: any[]): any {
    const item = {
      ids: messageIds
    };
    return this.post(`/api/Message/AddMessage2Spam`, item);
  }

  unSpamMessage(messageIds: any[]): any {
    const item = {
      ids: messageIds
    };
    return this.post(`/api/Message/RemoveMessageFromSpam`, item);
  }

  deletePending(id: any): any {
    return this.post(`/api/Message/DeletePending/${id}`, null);
  }


  /* Role */
  getRole(): Observable<any[]> {
    return this.get('/api/Role/GetRole');
  }

  getRoleGroup(): Observable<any[]> {
    return this.get('/api/Role/GetRole2');
  }

  addRole(item: any): any {
    return this.post('/api/Role', item);
  }

  updateRole(item: any): any {
    return this.put(`/api/Role/${item.id}`, item);
  }

  updateGroupRoles(item: any): any {
    return this.post('/api/Group/UpdateGroupRoles', item);
  }

  deleteRole(id: any): any {
    return this.delete(`/api/Role/${id}`, null);
  }

  contactFilter(item: any): any {
    return this.post('/api/Message/ContactFilter', item);
  }

  contactFilterByIds(item: any): any {
    return this.post('/api/Message/ContactFilterByIds', item);
  }

  getConversations(item: any): any {
    return this.post(`/api/Message/Conversation?id=${item.id}`, null);
  }

  getLogAction(id: any): any {
    return this.post(`/api/Message/GetLogAction?id=${id}`, null);
  }

  /*Check role*/
  checkPermission(roleIds: any[], per: number) {
    if (roleIds) {
      return roleIds.includes(per);
    } else {
      return false;
    }
  }

  confirmInbox(id: any): any {
    return this.post(`/api/Message/ConfirmInbox?id=${id}`, null);
  }

  unConfirmInbox(id: any): any {
    return this.post(`/api/Message/UnConfirmInbox?id=${id}`, null);
  }

  readInbox(id: any): any {
    return this.post(`/api/Message/ReadInbox/${id}`, null);
  }

  unReadInbox(id: any): any {
    return this.post(`/api/Message/UnReadInbox/${id}`, null);
  }

  getAvesContactByGroup(id: any): any {
    return this.post(`/api/Message/ContactByGroup?groupId=${id}`, null);
  }

  getContactByVipGroup(id: any): any {
    return this.post(`/api/Message/ContactByGroupVip?groupId=${id}`, null);
  }

  getAssignAvesGroup(): any {
    return this.get(`/api/Message/GetAvesGroup`);
  }

  getAssignVipGroup(): any {
    return this.get(`/api/Message/GetVipGroup`);
  }

  /*Dashboard*/
  getPieSources(item: any): any {
    return this.post(`/api/Message/ReportOutbox`, item);
  }

  getLineSources(item: any): any {
    return this.post(`/api/Message/ReportLast7DaysOutbox`, item);
  }

  searchContactByPhone(item: any): Observable<any[]> {
    return this.post(`/api/Message/SearchContact`, item);
  }

  searchContactByCmsName(item: any): Observable<any[]> {
    return this.post(`/api/Message/SearchContactByCMSName`, item);
  }

  syncAvesContact(item: any): any {
    return this.post('/api/Contact/SyncContact', item);
  }

  /*Log sms*/
  getSyncLog(): any {
    return this.get(`/api/Contact/GetLogSync`);
  }

  /*LDAP*/
  ldapUserExists(username: any): any {
    return this.post('/api/Login/LdapUserExists', {username});
  }

  reportChungLoaiTheoTinh(tinhThanhId: any): Observable<any> {
    console.log('tinhThanhId', tinhThanhId);
    // tslint:disable-next-line:use-isnan
    if (!tinhThanhId || tinhThanhId === NaN) {
      return this.get(`/DmChungLoai/ReportChungLoaiTheoTinh`);
    } else {
      return this.get(`/DmChungLoai/ReportChungLoaiTheoTinh/${tinhThanhId}`);
    }

  }

  fullReportExcel(payload): Observable<any> {
    return this.post('/api/Message/FullReportExcel', payload, null, 'blob');
  }
  queryCanhBao(payload): Observable<any> {
    return this.post('/ThietBi/QueryCanhBao', payload);
  }
  /*Black list*/
  getBlackList(payload): Observable<any> {
    return this.post('/api/BlackList/GetBlackListFilter', payload);
  }

  addPhoneToBlackList(phone: any): any {
    return this.post(`/api/BlackList/AddBlackList/${phone}`, null);
  }

  removePhoneFromBlackList(phone: any): any {
    return this.post(`/api/BlackList/RemoveBlackList/${phone}`, null);
  }

  // simbox
  checkSimBox(): Observable<any[]> {
    return this.post('/api/Message/CheckSimBox', null);
  }

  getAllConfigSim(): Observable<any[]> {
    return this.post('/api/Message/GetAllConfigSim', null);
  }


  disableSim(port: any): any {
    return this.post(`/api/Message/DisableSim/${port}`, null);
  }

  enableSim(port: any): any {
    return this.post(`/api/Message/EnableSim/${port}`, null);
  }

  configTelco(payload: any): any {
    return this.post(`/api/Message/ConfigTelco`, payload);
  }

  upload(FormData: any): Observable<any> {
    return this.post('/file/upload', FormData);
  }

  getSangKien(payload): Observable<any> {
    return this.post(`/SangKien/QuerySangKienDangxet`, payload);
  }

  addSangKien(item: any): any {
    return this.post('/SangKien/Post', item);
  }

  updateSangKien(item: any): any {
    return this.put(`/SangKien/${item.id}`, item);
  }

  deleteSangKien(id: any): any {
    return this.delete(`/SangKien/${id}`, null);
  }

  getThietBi(payload): Observable<any> {
    return this.post(`/ThietBi/QueryThietBi`, payload);
  }

  countThietBi(payload): Observable<any> {
    return this.post(`/ThietBi/CountThietBiByQuery`, payload);
  }

  addThietBi(item: any): any {
    return this.post(`/ThietBi/Post`, item);
  }

  updateThietBi(item: any): any {
    return this.put(`/ThietBi/${item.idDmthietBi}`, item);
  }

  deleteThietBi(id: any): any {
    return this.delete(`/ThietBi/${id}`, null);
  }

  /* Label */
  getDonViKiemDinh(): Observable<any[]> {
    return this.get('/DonViKiemDinh');
  }

  addDonViKiemDinh(item: any): any {
    return this.post('/DonViKiemDinh', item);
  }

  updateDonViKiemDinh(item: any): any {
    return this.put(`/DonViKiemDinh/${item.idDonViKiemDinh}`, item);
  }

  deleteDonViKiemDinh(id: any): any {
    return this.delete(`/DonViKiemDinh/${id}`, null);
  }

  /* Label */
  getCanBoKiemDinh(): Observable<any[]> {
    return this.get('/CanBoKiemDinh');
  }

  addCanBoKiemDinh(item: any): any {
    return this.post('/CanBoKiemDinh', item);
  }

  updateCanBoKiemDinh(item: any): any {
    return this.put(`/CanBoKiemDinh/${item.idCanBoKiemDinh}`, item);
  }

  deleteCanBoKiemDinh(id: any): any {
    return this.delete(`/CanBoKiemDinh/${id}`, null);
  }

  /* Label */
  getTinhthanh(): Observable<any[]> {
    const payload = {
      parentId: null
    };
    return this.post('/Tinhthanh/GetTinhthanh', payload);
  }
  getQuanHuyen(tinhThanhId): Observable<any[]> {
    const payload = {
      parentId: tinhThanhId
    };
    return this.post('/Tinhthanh/GetTinhthanh', payload);
  }
  addTinhthanh(item: any): any {
    return this.post('/Tinhthanh', item);
  }

  updateTinhthanh(item: any): any {
    return this.put(`/Tinhthanh/${item.idTinhThanh}`, item);
  }

  deleteTinhthanh(id: any): any {
    return this.delete(`/Tinhthanh/${id}`, null);
  }

  /* Label */
  getTrangThais(): Observable<any[]> {
    return this.get('/TrangThaiKiemDinh');
  }

  addTrangThaiKiemDinh(item: any): any {
    return this.post('/TrangThaiKiemDinh', item);
  }

  updateTrangThaiKiemDinh(item: any): any {
    return this.put(`/TrangThaiKiemDinh/${item.idTrangThaiKiemDinh}`, item);
  }

  deleteTrangThaiKiemDinh(id: any): any {
    return this.delete(`/TrangThaiKiemDinh/${id}`, null);
  }

  setTrangThaiDeXuat(item: any): any {
    return this.post(`/ThietBi/SetTrangThaiDeXuat`, item);
  }

  /* Label */
  getKeHoachKiemTra(): Observable<any> {
    return this.get(`/KeHoachKiemTra`);
  }

  addKeHoachKiemTra(item: any): any {
    return this.post('/KeHoachKiemTra', item);
  }

  updateKeHoachKiemTra(item: any): any {
    return this.put(`/KeHoachKiemTra/${item.idKeHoachKiemTra}`, item);
  }

  deleteKeHoachKiemTra(id: any): any {
    return this.delete(`/KeHoachKiemTra/${id}`, null);
  }

  /* Label */
  getBaoGia(): Observable<any[]> {
    return this.get('/BaoGia');
  }

  addBaoGia(item: any): any {
    return this.post('/BaoGia', item);
  }

  updateBaoGia(item: any): any {
    return this.put(`/BaoGia/${item.idBaoGia}`, item);
  }

  deleteBaoGia(id: any): any {
    return this.delete(`/BaoGia/${id}`, null);
  }

  /* Label */
  getDuToan(): Observable<any[]> {
    return this.get('/DuToan');
  }

  addDuToan(item: any): any {
    return this.post('/DuToan', item);
  }

  updateDuToan(item: any): any {
    return this.put(`/DuToan/${item.idDuToan}`, item);
  }

  deleteDuToan(id: any): any {
    return this.delete(`/DuToan/${id}`, null);
  }

  /* Label */
  getDmChungLoai(): Observable<any[]> {
    return this.get('/DmChungLoai');
  }

  addDmChungLoai(item: any): any {
    return this.post('/DmChungLoai', item);
  }

  updateDmChungLoai(item: any): any {
    return this.put(`/DmChungLoai/${item.id}`, item);
  }

  deleteDmChungLoai(id: any): any {
    return this.delete(`/DmChungLoai/${id}`, null);
  }

  getLog(payload): Observable<any> {
    return this.post(`/Dmlog/QueryDmlog`, payload);
  }

  getVanBan(payload): Observable<any> {
    return this.post(`/VanBan/GetVanBans`, payload);
  }
  addVanBan(item: any): any {
    return this.post(`/VanBan`, item);
  }
  updateVanBan(item: any): any {
    return this.put(`/VanBan/${item.id}`, item);
  }
  deleteVanBan(id: any): any {
    return this.delete(`/VanBan/${id}`, null);
  }
}

