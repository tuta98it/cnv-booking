import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from '../../../service/general-service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Constant, FireBase } from 'src/app/shared/constants/constant.class';
import { NotificationService } from '../../../service/notification.service';
import { DatePipe } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Menu } from '../../../model/menu.class';
import { ActionsSubject, Store } from '@ngrx/store';
import * as fromAuth from '../../auth/redux/auth.reducer';
import { MenuService } from '../../../service/menu.service';
import { AuthService } from '../../../service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminLayoutComponent } from '../../admin-layout/admin-layout.component';
import { FileManagerService } from '../../../service/file-manager.service';
import { UserType } from 'src/app/enums/user-type.enum';
import { MenuStateService } from 'src/app/shared/app-state/menu-state.service';
import { NotificationAPIService } from 'src/app/service/notification-service';
import { DeviceDetectorService } from 'ngx-device-detector';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { NotificationPageStateService } from 'src/app/app-state/notification-page-state.service';
import { NotificationBellStateService } from 'src/app/app-state/notification-bell-state.service';
import { PushNotificationService } from 'src/app/service/push-notification.service';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDgwJ4FeJ1wW8kzBDGub4J76ZNLBuT_mc",
  authDomain: "vhl-notification.firebaseapp.com",
  projectId: "vhl-notification",
  storageBucket: "vhl-notification.firebasestorage.app",
  messagingSenderId: "664705952523",
  appId: "1:664705952523:web:bb53e1806608ac7799500e",
  measurementId: "G-7WF2VJ24RK"
};

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss']
})
export class MasterPageComponent implements OnInit, OnDestroy {
  Constant = Constant;
  protected _menuSubscription: Subscription;
  isShowMenu: boolean = true;
  userTypeEnum = UserType;
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
  // menus: Menu[] = [];
  menus: any[] = [];
  modeMenu = false;
  pageName: string;
  roleIds: any[];
  // profile
  bucketId: any;
  loading: boolean;
  datas: any[];
  size = 'small';
  userInfo: any;
  selectionData: any;
  selectionPassword: any;
  isVisible = false;
  isVisibleUser = false;
  isVisiblePermission = false;
  isDisbled: boolean;
  isDisbledUser: boolean;
  isDisbledPermission: boolean;
  modalTitle = 'Thông tin của tôi';
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
  isCollapsed = false;
  app: any;
  messaging: any;

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
    private translate: TranslateService,
    private menuState: MenuStateService,
    private deviceService: DeviceDetectorService,
    private notificationAPIService: NotificationAPIService,
    private pushNotificationService: PushNotificationService,
    private notificationPageStateService: NotificationPageStateService,
    private notificationBellStateService: NotificationBellStateService,


  ) {
    this._menuSubscription = this.menuState.subscribe((m: boolean) => {
      this.isShowMenu = m;
    });
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
        // alert(this.url);
      });
    // this.getTinhThanh();

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(this.app);
  }
  private identifyDeviceType(): number {
    let deviceInfo = this.deviceService.getDeviceInfo();
    // Kiểm tra loại thiết bị và trả về mã loại tương ứng
    const isDesktopDevice = this.deviceService.isDesktop();
    if (isDesktopDevice) {
      return Constant.DEVICE.WEB.deviceType;
    }

    const isMobile = this.deviceService.isMobile();
    if (isMobile) {
      if (deviceInfo.os === 'IOS') {
        return Constant.DEVICE.IOS.deviceType;
      } else if (deviceInfo.os === 'Android') {
        return Constant.DEVICE.ANDROID.deviceType;
      } else {
        return Constant.DEVICE.UNKNOWN.deviceType;
      }
    }
    const isTablet = this.deviceService.isTablet();
    if (isTablet) {
      if (deviceInfo.os === 'IOS') {
        return Constant.DEVICE.IOS.deviceType;
      } else if (deviceInfo.os === 'Android') {
        return Constant.DEVICE.ANDROID.deviceType;
      } else {
        return Constant.DEVICE.UNKNOWN.deviceType;
      }
    }
    return Constant.DEVICE.UNKNOWN.deviceType;
  }

  private generateDeviceId(): string {

    // Lấy thông tin về trình duyệt và thiết bị
    // Lấy thông tin thiết bị để tạo fingerprint
    const deviceInfo = this.deviceService.getDeviceInfo();
    const userAgent = deviceInfo.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;

    // Kết hợp UUID với fingerprint để tạo deviceId duy nhất
    const combinedInfo = `${userAgent}|${platform}|${language}|${screenResolution}`;
    const deviceId = this.hashString(combinedInfo);

    return deviceId;
  }

  private hashString(input: string): string {
    // Hàm băm có thể là một hàm băm như SHA-256
    // Đây chỉ là một ví dụ đơn giản, bạn có thể sử dụng thư viện băm phổ biến.
    let hash = 0;
    if (input.length === 0) return hash.toString();
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }



  private async getDeviceFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId; // Đây là ID duy nhất cho thiết bị.
  }

  private requestPermission() {
    // console.log('Requesting permission...');
    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        // console.log('Notification permission granted.');
        let idDeviceStorage = localStorage.getItem(Constant.KEY_DEVICE_ID);
        const idDeviceGenerate = await this.getDeviceFingerprint();
        if (idDeviceStorage !== idDeviceGenerate) {
          let typeDevice: number = Constant.DEVICE.UNKNOWN.deviceType;
          let tokenFCM: string = localStorage.getItem(Constant.KEY_FIREBASE_TOKEN) ?? '';
          typeDevice = this.identifyDeviceType();

          getToken(this.messaging, { vapidKey: 'BNkSGw-jMSFtSoWzPgcI1L_EGwTTACfmGgK_n_gWko8O2Ib-KcTdZnfQM7DqtVnSnZFXhGyJHMmFbNfi436VZ48' }).then((currentToken) => {
            if (currentToken) {
              tokenFCM = currentToken;
              console.log('FCM Token:', currentToken);
              // Send the token to your server and update the UI if necessary
              // ...
              let payload = {
                tokenFCM: tokenFCM,
                deviceType: typeDevice,
                deviceId: idDeviceGenerate
              }

              this.notificationAPIService.deviceRegistration(payload).subscribe({
                next: (resDevicereGistration: any) => {
                  // console.log('resDevicereGistration.data: ', resDevicereGistration.data);
                },

                error: (err) => {
                  console.log('err: ', err);
                },

                complete: () => {
                  // console.log('complete: ');
                  // console.log('this.deviceInfo: ', idDeviceGenerate);
                  localStorage.setItem(Constant.KEY_DEVICE_INFO, idDeviceGenerate);
                  localStorage.setItem(Constant.KEY_FIREBASE_TOKEN, tokenFCM);
                }
              })

            } else {
              // Show permission request UI
              // this.notification.error('Không có sẵn mã tokenn thông báo đăng ký . Cần yêu cầu quyền để tạo mã.');
              // console.log('No registration token available. Request permission to generate one.');
              // ...
            }
          }).catch((err: any) => {
            // this.notification.error('Đã xảy ra lỗi khi truy xuất mã thông báo');
            // console.error('Đã xảy ra lỗi khi truy xuất mã thông báo');
            console.error('An error occurred while retrieving token:', err);
            localStorage.removeItem(Constant.KEY_DEVICE_INFO);
            localStorage.removeItem(Constant.KEY_FIREBASE_TOKEN);
            // Restart lại trang web
          });
        }
      } else {
        // this.notification.warn('Quyền thông báo của trình duyệt bị từ chối');
        // console.warn('Notification permission denied.');
      }
    });
  }

  ngAfterViewInit() {
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.menus = this.userInfo?.menus;
  }
  setUpdateNewNotification() {
    this.notificationBellStateService.sendStatus({ isNewData: true });
    this.notificationPageStateService.sendStatus({ isNewData: true });
  }
  ngOnInit(): void {

    if (Constant.PAGE_NOTIFY_CONFIG.some(path => this.router.url.includes(path))) {
      this.menuState.dispatch(false);
    } else {
      this.menuState.dispatch(true);
    }



    // Start push-notification
    this.requestPermission();
    // Handle incoming messages (push notifications)
    onMessage(this.messaging, (payloadNotity) => {
      this.setUpdateNewNotification();
      const notification = payloadNotity.notification;
      this.pushNotificationService.create(notification?.title ?? '', { body: notification?.body, icon: notification?.image }).subscribe({
        next: (resNotity: any) => {
          var event = resNotity.event;
          var notification = resNotity.notification;
          switch (event.type) {
            case 'show':
              // console.log('actioned: ', 'show');
              break;

            case 'click':
              // console.log('actioned: ', 'click');
              break;

            case 'error':
              // console.log('actioned: ', 'error');
              break;

            case 'close':
              // console.log('res: ', 'close');
              break;

            default:
              break;
          }
        },
        error: (err: any) => {

        },
        complete: () => { }
      });
      // ...
    });




    this.selectionPassword = {};
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    if (!this.userInfo) {
      localStorage.removeItem(Constant.TOKEN);
      localStorage.removeItem(Constant.USER_INFO);
      if (!Constant.PAGE_NOTIFY_CONFIG.some(path => this.router.url.includes(path))) {
        this.router.navigate(['/login']);
      }
    }
    this.loginUserID = this.userInfo?.id;
    this.username = this.userInfo?.fullname;
    this.roleIds = this.userInfo.roles;
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
        if (!Constant.PAGE_NOTIFY_CONFIG.some(path => this.router.url.includes(path))) {
          this.router.navigate(['/login']);
        }
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
      localStorage.removeItem(Constant.QUANHUYEN);
      localStorage.removeItem(Constant.KEY_DEVICE_ID);
      localStorage.removeItem(Constant.KEY_DEVICE_INFO);
      localStorage.removeItem(Constant.KEY_FIREBASE_TOKEN);
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
        this.selectionData.position = res.userGroups?.map(ug => ug?.group?.name).join(", "),
          this.selectionData.password = null;
        this.selectionData.roles = res.userRoles.map(en => en.roleId);
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
