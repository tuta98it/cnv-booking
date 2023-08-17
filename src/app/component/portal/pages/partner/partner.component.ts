import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constant } from 'src/app/shared/constants/constant.class';
import { AppConfigService } from 'src/app-config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents'
import { Workbook } from 'exceljs';
import { DateFormatPipe } from 'src/app/shared/pipe/format-date.pipe';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';
import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from "devextreme-angular";
@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListAccount") dataGridDetail: DxDataGridComponent;
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
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  formAccount: FormGroup;
  isVisibleAddAccount: boolean = false;
  isEnableUsername: boolean = false;
  titleFormPartner = '';
  constructor(
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private actionsSubject$: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe,
  ) {
    super('id');
    this.formAdd = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      taxCode: [null, [Validators.required]],
      phone: [null],
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      numberOfStaff: [null],
      debtMax: [null],
      debtUsed: [null],
      debtRemain: [null],
      note: [null],
      username: [null],
      password: [null],
      repeatPassword: [null],
    });
    // this.formAdd.controls.tinhThanhId.valueChanges.subscribe(($event) => {
    //   if ($event) {
    //     this.getQuanHuyen($event);
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
    this.getAllRole();

    this.formAccount = this.fb.group({
      // userId: [null, [Validators.required]],
      partnerId: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      repeatPassword: [null, [Validators.required]],
      fullname: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.baseUrl = this.configService.getConfig().api.baseUrl;

    this.get();
    this.getGroups();
    // this.getTinhThanh();
    this.getListData();
    this.getUserInfo();
  }

  ngOnDestroy(): void {

  }


  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    console.log('this.userInfor: ', this.userInfor);
  }

  getListData() {
    this.loading = true;
    this.generalService.getListPartner().subscribe(res => {
      if (res !== null) {
        this.datas = res;
        this.loading = false;
        let stt = 0;
        this.datas.forEach(en => {
          en.stt = ++stt;
          // en.roleStr = this.getQuyen(en.userroles);
        });
        this.filteredDatas = this.datas;
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

  showDeleteConfirm(id): void {
    this.get();
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa tài khoản này?',
      nzContent: '<b style="color: red;">Tài khoản sẽ thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItem(id)
    });
  }

  deleteItem(id) {
    // Delete workspace here
    this.generalService.deletePartner(id).subscribe(res => {
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
  }

  showModalAdd() {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.titleFormPartner = 'Thêm đối tác mới';
    this.formAdd.reset();
    this.formAdd.patchValue({
      id: 0,
      companyName: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      note: '',
      username: '',
      password: '',
      repeatPassword: '',
    });
  }

  showModalUpdate(data) {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.item = data;
    this.updated = true;
    this.titleFormPartner = 'Sủa thông tin đối tác';
    this.formAdd.patchValue({
      id: this.item.id,
      companyName: this.item.companyName,
      taxCode: this.item.taxCode,
      name: this.item.name,
      phone: this.item.phone,
      email: this.item.email,
      address: this.item.address,
      numberOfStaff: this.item.numberOfStaff,
      debtMax: this.item.debtMax,
      debtUsed: this.item.debtUsed,
      debtRemain: this.item.debtRemain,
      note: this.item.note,
      username: this.item.username,
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
    this.isVisibleAddAccount = false;
    this.formAdd.reset();
  }

  handleOk() {
    const formValue = this.formAdd.value;
    const checkEmail = this.validateEmail(formValue.email);
    this.submitted = true;


    if (this.formAdd.invalid) {
      return;
    } else {
      if (!checkEmail) {
        return;
      }
      if (formValue.id === 0) {
        delete formValue.id;
        // formValue.status = 1;

        this.generalService.addPartner(formValue).subscribe((res: any) => {
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
        this.generalService.updatePartner(formValue).subscribe((res: any) => {
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

  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }


  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_Tai_Khoan_Doi_Tac_${dateStr}`;
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

  onSearch() {
    const keyword = removeAccents(this.searchText.trim().toLowerCase());
    console.log(keyword);
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.id?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.name?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.companyName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.taxCode?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.phone?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.email?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.address?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.numberOfStaff?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.debtMax?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.debtUsed?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.debtRemain?.toString().trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.note?.trim()).toLowerCase().includes(keyword)
    );
  }

  showModalAccount(data) {
    this.isVisibleAddAccount = true;
    // this.formAccount.patchValue({
    //   id: data.userId,
    //   // id: 0,
    //   fullname: data.name,
    //   staffCode: data.code,
    //   email: data.email,
    //   phoneNo: data.phone,
    //   userType: this.userInfor.userType === 0 ? 1 : this.userInfor.userType === 1 ? 3 : null,
    //   partnerId: this.userInfor.userType === 0 ? null : this.userInfor.userType === 1 ? this.userInfor.id : null,
    //   // username: data.username,
    //   username: '',
    //   password: "",
    //   repeatPassword: "",
    // });

    this.formAccount.patchValue({
      // userId: data.userId,
      partnerId: data.id,
      fullname: data.name,
      username: data.username,
      password: "",
      repeatPassword: "",
    });
    if (data.username) this.isEnableUsername = true
    else this.isEnableUsername = false;
    console.log(this.formAccount.value);
  }

  handleOkAddAccount() {
    const formValue = this.formAccount.value;
    if (formValue.userId == null) {
      // delete formValue.id;
      this.generalService.postAccountForPartner(formValue).subscribe((res: any) => {
        if (!res.isValid) {
          this.notificationService.showNotification(
            Constant.ERROR,
            res.errors[0].errorMessage
          );
        } else {
          this.isVisibleAddAccount = false;
          // this.getPartners();
          this.notificationService.showNotification(
            Constant.SUCCESS,
            Constant.MESSAGE_ADD_SUCCESS
          );
          this.formAccount.reset();
        }
      });
    } else {
      this.generalService.changeUserPassword(formValue.userId, formValue).subscribe((res: any) => {
        if (!res.isValid) {
          this.notificationService.showNotification(
            Constant.ERROR,
            res.errors[0].errorMessage
          );
        } else {
          this.isVisibleAddAccount = false;
          // this.getPartners();
          this.notificationService.showNotification(
            Constant.SUCCESS,
            Constant.MESSAGE_UPDATE_SUCCESS
          );
          this.formAccount.reset();
        }
      });
    }
  }
}
