import {Component, isDevMode, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GeneralService} from '../../../service/general-service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Constant} from '../../../shared/constants/constant.class';
import {NotificationService} from '../../../service/notification.service';
import {DatePipe} from '@angular/common';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Menu} from '../../../model/menu.class';
import {ActionsSubject, Store} from '@ngrx/store';
import * as fromAuth from '../../auth/redux/auth.reducer';
import {MenuService} from '../../../service/menu.service';
import {AuthService} from '../../../service/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {AdminLayoutComponent} from '../../admin-layout/admin-layout.component';
import {FileManagerService} from '../../../service/file-manager.service';

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss']
})
export class MasterPageComponent implements OnInit, OnDestroy {
  static readonly ROUTE_DATA_PAGENAME = 'pagename';
  formSearch: FormGroup;
  isVisiblePopupChonMon: boolean;
  isVisiblePopupPhong: boolean;
  cartData: any[];
  products: any[];
  filterProducts: any[];
  selectedProduct: any;
  isDevMode: boolean;
  currentDate: any;
  searchOptions: any[];
  loaiMons: any[];
  selectedLoaiMon: number;
  phong: number;
  phongs: any[];
  showOrderForm: boolean;
  selectedProduct2: any;
  donhangs: any;
  now: any;

  storageDonHang: any[];
  donhangTrongNgay: any[];

  username: string;
  sub: Subscription;
  menus: Menu[] = [];
  pageName: string;
  roleIds: any[];
  // profile
  bucketId: any;
  loading: boolean;
  datas: any[];
  size = 'small';
  selectionData: any;
  selectionPassword: any;
  isVisible = false;
  isVisibleUser = false;
  isVisiblePermission = false;
  isDisbled: boolean;
  isDisbledUser: boolean;
  isDisbledPermission: boolean;
  modalTitle = 'Thông tin tài khoản';
  switchValue = false;
  dateFormat = 'yyyy/MM/dd';
  users: any[];
  selectionUserId: any;
  VIEW_ACCOUNT_LIST: boolean;
  VIEW_CONTACT_LIST: boolean;
  VIEW_DEVICE_LIST: boolean;
  VIEW_CONTACT_GROUP: boolean;
  VIEW_GROUP_PERMISSION: boolean;
  VIEW_LABEL: boolean;
  VIEW_MESSAGES_LIST: boolean;
  VIEW_TELCODE_LIST: boolean;
  PHAN_QUYEN_TAI_KHOAN: boolean;
  /*ADD_ACCOUNT: boolean;
  EDIT_ACCOUNT: boolean;*/
  loginUserID: any;
  selectedTab = 1;
  url: any;
  DANH_MUC_TB: boolean;
  TONG_HOP_TB: boolean;
  KIEM_DINH_TB: boolean;
  PHE_DUYET_TB: boolean;
  KE_HOACH_KIEM_DINH: boolean;
  BAO_GIA: boolean;
  DU_TOAN: boolean;
  BAO_CAO_KIEM_DINH: boolean;
  VAN_BAN: boolean;
  QUAN_LY_DANH_MUC: boolean;
  tinhThanhs = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private fileManagerService: FileManagerService,
    private notificationService: NotificationService,
    private activeRoute: ActivatedRoute,
    private store: Store<fromAuth.AppState>,
    private actionsSubject$: ActionsSubject,
    private menuService: MenuService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.formSearch = this.fb.group({
      text_search: [null]
    });
    this.isVisiblePopupChonMon = false;
    // this.titleService.setTitle('File management');
    this.cartData = [];
    this.isDevMode = isDevMode();
    this.currentDate = new Date();
    this.selectedLoaiMon = 0;
    this.isVisiblePopupPhong = false;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe(event => {
      // @ts-ignore
      this.url = event.url;
      console.log(this.url);
      // alert(this.url);
    });
    // this.getTinhThanh();
  }
  ngOnInit(): void {
    this.selectionPassword = {};
    const userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    if (!userInfo) {
      localStorage.removeItem(Constant.TOKEN);
      localStorage.removeItem(Constant.USER_INFO);
      this.router.navigate(['/login']);
    }
    this.loginUserID = userInfo.id;
    this.username = userInfo.fullname;
    this.roleIds = userInfo.roles;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getPageInfo())).subscribe((pageName: string) => {
      this.pageName = this.translate.instant(pageName);
    });
    this.pageName = this.translate.instant(this.getPageInfo());
    this.authService.checkToken().subscribe(res => {
      if (res.ret && res.ret[0].code === 401) {
        localStorage.removeItem(Constant.TOKEN);
        localStorage.removeItem(Constant.USER_INFO);
        this.router.navigate(['/login']);
      }
    });
    this.DANH_MUC_TB = this.checkPermission(Constant.DANH_MUC_TB);
    this.TONG_HOP_TB = this.checkPermission(Constant.TONG_HOP_TB);
    this.KIEM_DINH_TB = this.checkPermission(Constant.KIEM_DINH_TB);
    this.PHE_DUYET_TB = this.checkPermission(Constant.PHE_DUYET_TB);
    this.KE_HOACH_KIEM_DINH = this.checkPermission(Constant.KE_HOACH_KIEM_DINH);
    this.BAO_GIA = this.checkPermission(Constant.BAO_GIA);
    this.DU_TOAN = this.checkPermission(Constant.DU_TOAN);
    this.BAO_CAO_KIEM_DINH = this.checkPermission(Constant.BAO_CAO_KIEM_DINH);
    // this.PHAN_QUYEN_TAI_KHOAN = this.checkPermission(Constant.PHAN_QUYEN_TAI_KHOAN);
    this.PHAN_QUYEN_TAI_KHOAN = true;
    this.QUAN_LY_DANH_MUC = this.checkPermission(Constant.QUAN_LY_DANH_MUC);
    this.VAN_BAN = true;
  }
  checkPermission(per: number): boolean {
    return this.fileManagerService.checkPermission(this.roleIds, per);
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  private getPageInfo() {
    let child = this.activeRoute.firstChild;
    while (child.firstChild) {
      child = child.firstChild;
    }
    if (child.snapshot.data[AdminLayoutComponent.ROUTE_DATA_PAGENAME]) {
      return child.snapshot.data[MasterPageComponent.ROUTE_DATA_PAGENAME];
    }
    return '';
  }
  logout() {
    this.sub = this.authService.logout().subscribe(res => {
      localStorage.removeItem(Constant.TOKEN);
      localStorage.removeItem(Constant.USER_INFO);
      localStorage.removeItem(Constant.TINHTHANH);
      localStorage.removeItem(Constant.QUANHUYEN);
      this.router.navigate(['/login']);
    });
  }
  getUserById() {
    this.generalService.getTaikhoanById(this.loginUserID).subscribe(res => {
      if (res !== null) {
        this.isDisbledUser = false;
        this.isVisibleUser = true;
        this.selectionUserId = null;
        this.selectionData = res;
        this.selectionData.password = null;
        this.selectionData.roles = res.userroles.map(en => en.roleId);
        console.log(this.selectionData);
      }
    }, error => {

    });
  }
  showModalUser(): void {
    this.getUserById();
  }
  handleCancel(): void {
    this.isVisibleUser = false;
  }
  handleOk(): void {
    if (this.selectedTab === 1) {
      this.updateProfile();
    } else {
      this.changePassword();
    }
  }
  updateProfile(): void {
    this.fileManagerService.updateUser(this.selectionData).subscribe(res => {
      this.isDisbled = false;
      if (res && res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
      } else {
        this.isVisibleUser = false;
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
      }
    }, error => {

    });
  }
  changePassword(): void {
    // alert('change password');
    this.fileManagerService.changePassword(this.selectionPassword).subscribe(res => {
      this.isDisbled = false;
      if (res && res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
      } else {
        this.isVisibleUser = false;
        this.notificationService.showNotification(Constant.SUCCESS, 'Đổi mật khẩu thành công');
      }
    }, error => {

    });
  }
  selectedTable(tabIndex: number) {
    this.selectedTab = tabIndex;
  }
  getTinhThanh() {
    this.generalService.getTinhThanh(null).subscribe(res => {
      if (res !== null) {
        this.tinhThanhs = res;
      }
    }, error => {

    });
  }
}
