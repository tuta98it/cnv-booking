import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionsSubject, select, Store} from '@ngrx/store';
import * as fromRole from '../../role/redux/role.reducer';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../service/notification.service';
import {AppConfigService} from '../../../../app-config.service';
import {Constant} from '../../../shared/constants/constant.class';
import {GeneralService} from '../../../service/general-service';
import {TableSelectionAbstract} from '../../../shared/component/table/table-selection.abstract';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-taikhoan-list',
  templateUrl: './taikhoan-list.component.html',
  styleUrls: ['./taikhoan-list.component.scss']
})
export class TaikhoanListComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  datas: any[] = [];
  data: any;
  passwordVisible: boolean;
  repeatpasswordVisible: boolean;
  isVisibleAdd: boolean;
  isVisibleUpdate: boolean;
  isVisiblePassword: boolean;
  item: any;
  loading: boolean;
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  formAdd: FormGroup;
  formUpdate: FormGroup;
  formPassword: FormGroup;
  isVisibleGroup: boolean;

  constructor(
    public store: Store<fromRole.AppState>,
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private actionsSubject$: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder
  ) {
    super('id');
    this.formAdd = this.fb.group({
      id: [null],
      ho: [null],
      ten: [null],
      username: [null],
      password: [null],
      repeatPassword: [null],
      roles: [null],
    });
    this.formUpdate = this.fb.group({
      id: [null],
      ho: [null],
      ten: [null],
      username: [null],
      roles: [null],
    });
    this.formPassword = this.fb.group({
      id: [null],
      password: [null],
      repeatPassword: [null],
    });
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.getListData();
    this.get();
  }

  ngOnDestroy(): void {

  }

  getListData() {
    this.loading = true;
    this.generalService.getTaikhoan().subscribe(res => {
      if (res !== null) {
        this.datas = res;
        this.loading = false;
        super.setListOfAllData(this.datas);
      }
    }, error => {

    });
  }

  get() {
    this.translate.use(this.translate.currentLang).subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }

  showConfirm(id): void {
    this.get();
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bạn có muốn xóa hay không.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Bỏ qua',
      nzOnOk: () => this.deleteItem(id)
    });
  }

  deleteItem(id) {
    this.generalService.deleteTaikhoan(id).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_DELETE_SUCCESS);
      this.getListData();
    }, error => {

    });
  }

  showModalAdd() {
    this.isVisibleAdd = true;
    this.formAdd.patchValue({
      id: 0,
      ho: '',
      ten: '',
      username: '',
      password: '',
      repeatPassword: '',
      roles: [],
    });
  }

  showModalUpdate(data) {
    this.isVisibleUpdate = true;
    this.item = data;

    this.formUpdate.patchValue({
      id: this.item.id,
      ho: this.item.ho,
      ten: this.item.ten,
      username: this.item.username,
      roles: this.getRoles(this.item.userRole),
    });
  }

  showModalPassword(data) {
    this.isVisiblePassword = true;
    this.item = data;

    this.formPassword.patchValue({
      id: this.item.id,
      password: '',
      repeatPassword: '',
    });
  }

  handleCancel() {
    this.isVisibleAdd = false;
  }

  handleOk() {
    const formValue = this.formAdd.value;
    // console.log(formValue);

    delete formValue.id;
    this.generalService.addTaikhoan(formValue).subscribe(res => {
      if (res !== null && res !== undefined && res.ret !== null && res.ret !== undefined && res.ret.code != 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret.message);
      } else {
        this.getListData();
        this.isVisibleAdd = false;
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
      }
    }, error => {

    });

  }

  handleCancelUpdate() {
    this.isVisibleUpdate = false;
  }

  handleOkUpdate() {
    const formValue = this.formUpdate.value;
    // console.log(formValue);
    this.generalService.updateTaikhoan(formValue).subscribe(res => {
      if (res !== null && res.ret !== undefined && res.ret.code != 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret.message);
      } else {
        this.getListData();
        this.isVisibleUpdate = false;
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
      }
    }, error => {

    });
  }

  handleCancelPassword() {
    this.isVisiblePassword = false;
  }

  handleOkPassword() {
    const formValue = this.formPassword.value;
    // console.log(formValue);
    this.generalService.updateUserPassword(formValue).subscribe(res => {
      if (res !== null && res !== undefined && res.ret !== null && res.ret !== undefined && res.ret.code != 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret.message);
      } else {
        this.getListData();
        this.isVisiblePassword = false;
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
      }
    }, error => {

    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
  getHoTen = (ho, ten) => ho + ' ' + ten;

  getQuyen(roles) {
    var s = '';
    for (var i = 0; i < roles.length; i++) {
      if (s === '') {
        s += this.getTenQuyen(roles[i].roleId);
      } else {
        s += '. ' + this.getTenQuyen(roles[i].roleId);
      }
    }
    return s;
  }

  getTenQuyen(role) {
    if (role === 1) {
      return 'Quản trị';
    } else if (role === 2) {
      return 'Xem danh sách nhân sự';
    } else if (role === 3) {
      return 'Quản lý phòng ban';
    } else if (role === 4) {
      return 'Sửa chi tiết nhân sự';
    } else if (role === 5) {
      return 'Quản lý user';
    } else if (role === 6) {
      return 'Quản lý group user';
    } else if (role === 7) {
      return 'Duyệt xin nghỉ';
    } else if (role === 8) {
      return 'Chấm công';
    }

    return '';
  }

  getRoles(userRole) {
    var s = [];
    for (var i = 0; i < userRole.length; i++) {
      s[i] = userRole[i].roleId;
    }
    return s;
  }

  showModalGroup(data) {
    console.log(data);
    this.isVisibleGroup = true;
    this.item = data;
  }

  closeModalGroups() {
    this.isVisibleGroup = false;
  }
}
