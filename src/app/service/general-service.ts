import {Injectable} from '@angular/core';
import {BaseService} from '../shared/base-service/base-service.service';
import {Observable} from 'rxjs';
import {UrlConstant} from '../shared/constants/url.class';
import {Role} from '../model/role.class';

@Injectable()
export class GeneralService extends  BaseService {
  //phong
  getPhong(): Observable<any[]> {
    return this.get(UrlConstant.LIST_PHONG);
  }
  getChiTietPhong(id: number): Observable<any[]> {
    return this.get(UrlConstant.LIST_PHONG+ '/' + id);
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
    return this.post(UrlConstant.LIST_NHOMTAIKHOAN + '/AddUser2Group', item);
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
    return this.post( UrlConstant.FILE + '/UploadFirstImport', FormData);
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

  //partner
  

}
