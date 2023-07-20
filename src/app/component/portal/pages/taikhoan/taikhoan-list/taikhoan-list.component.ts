import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionsSubject, select, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {GeneralService} from 'src/app/service/general-service';
import {TableSelectionAbstract} from 'src/app/shared/component/table/table-selection.abstract';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from 'src/app/shared/constants/constant.class';
import {AppConfigService} from 'src/app-config.service';
import {NotificationService} from 'src/app/service/notification.service';

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
  isVisibleUserGroup: boolean;
  item: any;
  loading: boolean;
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  submitted = false;
  updated: boolean;
  pageSize: any;
  page: any;
  defaultPage: any;
  formAdd: FormGroup;
  formPassword: FormGroup;
  allRoles: any[];
  usergroups: any[];
  baseUrl: any;
  signature: any = {};
  urlServiceSignature = '';
  groups = [];
  chooseGroup: any;
  tinhThanhs = [];
  quanHuyens = [];
  constructor(
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
      fullname: [null],
      username: [null],
      phoneNo: [null],
      email: [null],
      status: [null],
      password: [null],
      repeatPassword: [null],
      roles: [null],
      signatureImageUrl: [null, [Validators.required]],
      staffCode: [null],
      tinhThanhId: [null],
      quanHuyenId: [null]
    });
    this.formAdd.controls.tinhThanhId.valueChanges.subscribe(($event) => {
      if ($event) {
        this.getQuanHuyen($event);
      }
    })
    this.formPassword = this.fb.group({
      id: [null],
      password: [null],
      repeatPassword: [null],
    });
    this.signature = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };
    this.urlServiceSignature =
      this.configService.getConfig().api.baseUrl + `/Upload/UploadFile`;
    this.getAllRole();
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.baseUrl = this.configService.getConfig().api.baseUrl;

    this.get();
    this.getGroups();
    this.getTinhThanh();
    this.getListData();
  }

  ngOnDestroy(): void {

  }

  getListData() {
    this.loading = true;
    this.generalService.getTaikhoan().subscribe(res => {
      if (res !== null) {
        this.datas = res;
        this.loading = false;
        let stt = 0;
        this.datas.forEach(en => {
          stt++;
          en.stt = stt;
          console.log(en.userroles);
          en.roleStr = this.getQuyen(en.userroles);
          console.log(en.roleStr);
        });
        // console.log(this.datas);
        super.setListOfAllData(this.datas);
      }
    }, error => {

    });
  }

  validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || !mail) {
      return (true);
    }
    alert('Chưa đúng định dạng email!');
    return (false);
  }

  get f() {
    return this.formAdd.controls;
  }

  get() {
    this.translate.use(this.translate.currentLang).subscribe(data => {
      this.data = data;

    });
  }

  getAllRole() {
    this.generalService.getRole().subscribe(res => {
      if (res !== null) {
        this.allRoles = res;
      }
    }, error => {

    });
  }

  showConfirm(id): void {
    this.get();
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bạn có muốn xóa hay không?',
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
    this.formAdd.reset();
    this.formAdd.patchValue({
      id: 0,
      fullname: '',
      username: '',
      phoneNo: '',
      email: '',
      password: '',
      repeatPassword: '',
      signatureImageUrl: '',
      roles: [],
      staffCode: ''
    });
  }

  showModalUpdate(data) {
    this.isVisibleAdd = true;
    this.item = data;
    this.updated = true;

    this.formAdd.patchValue({
      id: this.item.id,
      fullname: this.item.fullname,
      status: this.item.status,
      username: this.item.username,
      phoneNo: this.item.phoneNo,
      email: this.item.email,
      signatureImageUrl: this.item.signatureImageUrl,
      roles: this.getRoles(this.item.userroles),
      staffCode: this.item.staffCode
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

  // @ts-ignore
  showModalUserGroup(data) {
    this.usergroups = [];
    this.item = data;
    this.isVisibleUserGroup = true;
    this.getGroupByUser();
  }
  getGroupByUser() {
    this.generalService.getTaikhoanById(this.item.id).subscribe(res => {
      if (res !== null) {
        this.usergroups = res.usergroups.map(en => en.group);
        const userGroupIds = res.usergroups.map(en => en.groupId);
        this.generalService.getGroup().subscribe(res2 => {
          if (res2 !== null) {
            this.groups = res2.filter(en => !userGroupIds.includes(en.id));
          }
        }, error => {

        });
      }
    }, error => {

    });
  }

  handleCancelUserGroup() {
    this.isVisibleUserGroup = false;
  }

  handleCancel() {
    this.isVisibleAdd = false;
    this.updated = false;
    this.formAdd.reset();
  }

  handleOk() {
    const formValue = this.formAdd.value;
    const checkEmail = this.validateEmail(formValue.email);
    if (!checkEmail) {
      return;
    }
    if (formValue.id === 0) {
      delete formValue.id;
      formValue.status = 1;
      this.generalService.addTaikhoan(formValue).subscribe(res => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
          formValue.id = 0;
        } else {
          this.getListData();
          this.isVisibleAdd = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, error => {

      });
    } else {
      this.generalService.updateTaikhoan(formValue).subscribe(res => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisibleAdd = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      });
    }
  }

  handleCancelPassword() {
    this.isVisiblePassword = false;
  }

  getGroups() {
    this.loading = true;

  }

  handleOkPassword() {
    const formValue = this.formPassword.value;
    this.generalService.updateUserPassword(formValue).subscribe(res => {
      if (res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
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
    if (this.allRoles) {
      // console.log(roles, this.allRoles);
      const userRoleIds = roles.map(en => en.roleId);
      const userRoles = this.allRoles.filter(en => userRoleIds.includes(en.id));
      return userRoles.map(en => en.name).join(', ');
    }
  }

  getRoles(userRole) {
    const s = [];
    for (let i = 0; i < userRole.length; i++) {
      s[i] = userRole[i].roleId;
    }
    return s;
  }

  onDeleteClick(id: any): void {
    // alert(id)
    const c = confirm('Bạn có chắc muốn xóa tài khoản này?');
    if (c === true) {
      // Delete workspace here
      this.generalService.deleteTaikhoan(id).subscribe(res => {
        // Do some logic and close the popup
        if (res && res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa.');
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thành công');
          this.getListData();
        }
      }, error => {
        // Error handling and close the popup

      });
    } else {
    }
  }

  showConfirmRemoveGroup(groupId): void {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bạn có muốn xóa hay không.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Bỏ qua',
      nzOnOk: () => this.removeUserFromGroup(this.item.id, groupId)
    });
  }
  removeUserFromGroup(userId, groupId) {
    const params = {userId, groupId};
    this.generalService.removeUserFromGroup(params).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa nhóm thành công');
      this.getGroupByUser();
    }, error => {

    });
  }
  addGroup2User() {
    const payload = { userId: this.item.id, groupId: this.chooseGroup.id};
    this.generalService.addUserToGroup(payload).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Thêm nhóm tài khoản thành công');
      this.getGroupByUser();
    }, error => {

    });
  }
  getTinhThanh() {
    this.generalService.getTinhThanh(null).subscribe(res => {
      if (res !== null) {
        this.tinhThanhs = res;
      }
    }, error => {

    });
  }
  getQuanHuyen(tinhthanhId) {
    this.generalService.getTinhThanh(tinhthanhId).subscribe(res => {
      if (res !== null) {
        this.quanHuyens = res;
      }
    }, error => {

    });
  }
}
