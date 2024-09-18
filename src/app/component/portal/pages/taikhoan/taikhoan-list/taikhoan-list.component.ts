import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constant } from 'src/app/shared/constants/constant.class';
import { AppConfigService } from 'src/app-config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Workbook } from 'exceljs';
import { DateFormatPipe } from 'src/app/shared/pipe/format-date.pipe';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';
// import { removeAccents } from ;
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents'
import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from "devextreme-angular";
import { IsEmptyPipe } from 'src/app/shared/pipe/is-empty.pipe';
import { UserType } from 'src/app/enums/user-type.enum';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';
import { Router } from '@angular/router';
import { TEXT_USER_STATUS } from 'src/app/enums/user-status.enum';
import { EmployeePipePipe } from 'src/app/shared/pipe/employeePipe.pipe';
@Component({
  selector: 'app-taikhoan-list',
  templateUrl: './taikhoan-list.component.html',
  styleUrls: ['./taikhoan-list.component.scss']
})
export class TaikhoanListComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListAccount") dataGridDetail: DxDataGridComponent;
  // @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  valueNumberPhone = '';
  @ViewChild('inputElementNumberPhone', { static: false }) inputElementNumberPhone?: ElementRef
  ActionTypePageVHL = ActionTypePageVHL;
  datas: any[] = [];
  userTypeEnum = UserType;
  userType : UserType = this.userTypeEnum.All;
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
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  titleFormUser = '';
  constructor(
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private actionsSubject$: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe,
    private router: Router,
  ) {
    super('id');
    this.formAdd = this.fb.group({
      id: [null],
      fullname: [null, [Validators.required]],
      roles: [null],
      phoneNo: [null, [Validators.required]],
      email: [null, [Validators.required]],
      status: [null],
      department: [null],
      staffCode: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null],
      repeatPassword: [null],
      position: [null, [Validators.required]],
      partnerId: [null],
      // signatureImageUrl: [null, [Validators.required]],
      // province: [null],
      // district: [null],
      // tinhThanhId: [null],
      // quanHuyenId: [null]
    });
    // this.formAdd.controls.tinhThanhId.valueChanges.subscribe(($event) => {
    //   if ($event) {
    //     // this.getQuanHuyen($event);
    //   }
    // })
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
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.baseUrl = this.configService.getConfig().api.baseUrl;

    this.get();
    this.getGroups();
    // this.getTinhThanh();
    this.getUserInfo();
    this.getListData();
  }
  onChangeNumberPhone(value: string): void {
    this.updateValueNumberPhone(value);
  }

  updateValueNumberPhone(value: string): void {
    const reg = /^[0-9 | + | * | ( | ) | #]*$/;
    if (reg.test(value) || value === '') {
      this.valueNumberPhone = value;
    }
    this.inputElementNumberPhone!.nativeElement.value = this.valueNumberPhone;
    // this.updateTitle();
  }
  ngOnDestroy(): void {

  }


  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  getListData() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      let service: any;
      if (this.userInfor.userType === 0) {
        // this.userInfor.userType
        this.generalService.queryByUserType({userType : this.userType}).subscribe((res: any) => {
          if (res !== null) {
            this.datas = res;
            let stt = 0;
            this.datas.forEach(en => {
              stt++;
              en.stt = stt;
              en.isLoadingActiveUser = false;
              en.directManagementUserName = en?.directManagementUser?.fullname;
              en.statusText = TEXT_USER_STATUS[en.status];
              en.roleStr = this.getQuyen(en.userroles);
            });
            this.filteredDatas = this.datas;
            super.setListOfAllData(this.datas);
            resolve(true);
            this.loading = false;
          }
        }, error => {
        });
      } else if (this.userInfor.userType === 1) {
        this.generalService.getUsersByPartnerId(this.userInfor.partnerId).subscribe((res: any) => {
          if (res !== null) {
            this.datas = res.data;
            let stt = 0;
            this.datas.forEach(en => {
              stt++;
              en.stt = stt;
              en.isLoadingActiveUser = false;
              en.roleStr = this.getQuyen(en.userroles);
            });
            this.filteredDatas = this.datas;
            super.setListOfAllData(this.datas);
            resolve(true);
            this.loading = false;
          }
        }, error => {
        });;
        // isGetAPT = true;
      } else {
        console.log('UserType không hợp lệ!');
      }
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

  showIsActiveUserConfirm(user: any): void {
    this.get();
    let changeIsActiveUser = !user.status;
    user.isLoadingActiveUser = true;
    this.modalService.confirm({
      nzTitle: `<b>Bạn có chắc muốn ${changeIsActiveUser ? "Active" : "Inactive"} tài khoản này?</b>`,
      nzContent: 'Ấn đồng ý để tiếp tục',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.setStatusUser(user, changeIsActiveUser),
      nzOnCancel: () => this.cancelActiveUserConfirm(user)
    });
  }

  private cancelActiveUserConfirm(user: any) {
    user.isLoadingActiveUser = false;
  }
  setStatusUser(user: any, changeIsActiveUser: boolean) {
    // Delete workspace here
    this.generalService.setStatusUser(user.id, changeIsActiveUser).subscribe({
      next: (res) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, 'Thiết lập trạng thái tài khoản không thành công');
        } else {
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Thiết lập trạng thái tài khoản đã gặp lỗi');
      },

      complete: () => {
        this.getListData().then(() => {
          this.notificationService.showNotification(Constant.SUCCESS, `${changeIsActiveUser ? 'Active' : 'Inactive'} tài khoản thành công`);
        });
      }

    }).add(() => { user.isLoadingActiveUser = false; });
  }

  showModalAdd() {

    this.isVisibleAdd = true;
    this.submitted = false;
    this.titleFormUser = 'Thêm mới tài khoản';
    this.formAdd.reset();
    this.formAdd.patchValue({
      id: 0,
      fullname: '',
      roles: [],
      status: 0,
      phoneNo: '',
      email: '',
      department: '',
      staffCode: '',
      username: '',
      password: '',
      repeatPassword: '',
      position: '',
      partnerId: this.userInfor.id == 0 ? null : this.userInfor.partnerId
    });
  }

  showModalUpdate(data) {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.item = data;
    this.titleFormUser = 'Sủa thông tin tài khoản';
    this.updated = true;

    this.formAdd.patchValue({
      id: this.item.id,
      fullname: this.item.fullname,
      roles: this.item.roles,
      status: this.item.status,
      phoneNo: this.item.phoneNo,
      email: this.item.email,
      staffCode: this.item.staffCode,
      department: this.item.department,
      username: this.item.username,
      position: this.item.position,
      partnerId: this.item.partnerId
    });

  }


  navigatePage(url: string, typeAction: number, employee?: any) {
    switch (typeAction) {
      case ActionTypePageVHL.Create:
        this.router.navigate([`${url}`], { queryParams: { partnerId: employee?.partnerId } })
        break;
      case ActionTypePageVHL.Update:
        this.router.navigate([`${url}`], { queryParams: { employeeId: employee.id, partnerId: employee.partnerId } })
        break;
      default:
        break;
    }
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
    let formValue = this.formAdd.value;
    const checkEmail = this.validateEmail(formValue.email);
    this.submitted = true;

    let userType: any;
    if (formValue.id === 0) {
      if (this.formAdd.invalid || this.isEmpty(this.formAdd.controls['password'].value) || this.isEmpty(this.formAdd.controls['repeatPassword'].value)) {
        return;
      }

      if (!checkEmail) {
        this.notificationService.showNotification(Constant.ERROR, 'Email không đúng định dạng!');
        return;
      }
      delete formValue.id;
      formValue.status = 1;
      userType = this.userInfor.userType == 0 ? 2 : this.userInfor.userType == 1 ? 3 : null;
      const payload = { ...formValue, 'userType': userType };
      this.generalService.addTaikhoan(payload).subscribe((res: any) => {
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
      if (this.formAdd.invalid) {
        return;
      }

      if (!checkEmail) {
        // this.notificationService.showNotification(Constant.ERROR, 'Email không đúng định dạng!');
        return;
      }

      delete formValue.password;
      delete formValue.repeatPassword;
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
      const userRoleIds = roles.map(en => en.roleId);
      const userRoles = this.allRoles.filter(en => userRoleIds.includes(en.id));
      return userRoles.map(en => en.name).join(', ');
    }
  }

  onDeleteClick(id: any): void {
    // alert(id)
    const c = confirm('Bạn có chắc muốn xóa tài khoản này?');
    // this.modalService.confirm({
    //   nzTitle: 'Confirm',
    //   nzContent: 'Bạn có muốn xóa hay không?',
    //   nzOkText: 'Đồng ý',
    //   nzCancelText: 'Bỏ qua',
    //   nzOnOk: () => this.deleteItem(id)
    // });
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
        this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra!');
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
    const params = { userId, groupId };
    this.generalService.removeUserFromGroup(params).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Xóa nhóm thành công');
      this.getGroupByUser();
    }, error => {

    });
  }
  addGroup2User() {
    const payload = { userId: this.item.id, groupId: this.chooseGroup.id };
    this.generalService.addUserToGroup(payload).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, 'Thêm nhóm tài khoản thành công');
      this.getGroupByUser();
    }, error => {

    });
  }


  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }


  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_Tai_Khoan_${dateStr}`;
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx');
      });
    });
    e.cancel = true;
  }




  // String.prototype.removeAccents = function() {
  //   return this
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "");
  // };

  onSearch() {
    const keyword = removeAccents(this.searchText.trim().toLowerCase());
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.id?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.fullname?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.username?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.phoneNo?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.email?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.department?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.staffCode?.trim()).toLowerCase().includes(keyword)
    );
  }


  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }

    if (Array.isArray(value) && value.length === 0) {
      return true;
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }

    return false;
  }
  // getTinhThanh() {
  //   this.generalService.getTinhThanh(null).subscribe(res => {
  //     if (res !== null) {
  //       this.tinhThanhs = res;
  //     }
  //   }, error => {

  //   });
  // }
  // getQuanHuyen(tinhthanhId) {
  //   this.generalService.getTinhThanh(tinhthanhId).subscribe(res => {
  //     if (res !== null) {
  //       this.quanHuyens = res;
  //     }
  //   }, error => {

  //   });
  // }
}
