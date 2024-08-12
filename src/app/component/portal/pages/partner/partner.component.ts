import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from "devextreme-angular";
import { TypeOfDocument } from 'src/app/enums/type-of-document.enum';
import { Router } from '@angular/router';
@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  readonly allowedPageSizes = [10, 20, 50, 100, 200, 'all'];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  TypeOfDocument = TypeOfDocument;
  @ViewChild("ListAccount") dataGridDetail: DxDataGridComponent;
  valueNumberPhone = '';
  @ViewChild('inputElementNumberPhone', { static: false }) inputElementNumberPhone?: ElementRef;
  datas: any[] = [];
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
  submitted = false;
  updated: boolean;
  pageSize: any;
  page: any;
  defaultPage: any;
  formAdd: FormGroup;
  formPassword: FormGroup;
  allRoles: any[];
  baseUrl: any;
  signature: any = {};
  urlServiceSignature = '';
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  formAccount: FormGroup;
  isVisibleAddAccount: boolean = false;
  isEnableUsername: boolean = false;
  titleFormPartner = '';
  uploadHeader: any;
  baseImageurl = '';
  uploadUrl = '';
  order: any;
  selectedResult: any;
  previewUrl = '';
  visibleUpload = false;
  previewFileResult = false;
  curFileResults = [];
  newFileResults = [];
  constructor(
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe,
    private router: Router,
  ) {
    super('id');
    this.formAdd = this.fb.group({
      id: [null],
      userId: [null],
      name: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      taxCode: [null, [Validators.required]],
      phone: [null],
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
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
      userId: [null, [Validators.required]],
      partnerId: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      repeatPassword: [null, [Validators.required]],
      fullname: [null, [Validators.required]],
    });

    this.uploadHeader = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    };
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadFile`;
    this.baseImageurl = this.configService.getConfig().api.baseUrl + '/Uploads/';
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
  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.baseUrl = this.configService.getConfig().api.baseUrl;
    this.getListData();
    this.getUserInfo();
  }

  ngOnDestroy(): void {

  }


  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
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
        });
        this.filteredDatas = this.datas;
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

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {

    }
    this.previewUrl = this.configService.getConfig().api.url + '/' + file.response[0].path;
    this.previewFileResult = true;
  }

  handleRemove = async (file: NzUploadFile): Promise<void> => {
    const path = file.response[0].path;
    if (path) {
      this.newFileResults = this.newFileResults.filter(en => en.filePath !== path);
    }
  }

  getAllRole() {
    this.generalService.getRole().subscribe(res => {
      if (res !== null) {
        this.allRoles = res;
      }
    }, error => {

    });
  }

  showDeleteConfirm(partner: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa tài khoản này?',
      nzContent: '<b style="color: red;">Tài khoản sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItem(partner)
    });
  }

  deleteItem(partner: any) {
    // Delete workspace here
    this.generalService.deletePartner(partner.id).subscribe(res => {
      // Do some logic and close the popup
      if (res && res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, 'Xoá thông tin đối tác thất bại');
      } else {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa thông tin đối tác thành công');
        this.getListData();
      }
    }, error => {
      // Error handling and close the popup

    });
    if (partner.userId) {
      this.generalService.deleteUserByID(partner.userId).subscribe({
        next: (res: any) => {
          if (res && res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, 'Xoá tài khoản đối tác thất bại');
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, 'Xoá tài khoản đối tác thành công');
            this.getListData();
          }
        },
        error: (error: any) => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xoá tài khoản đối tác thành công');
        },
        complete: () => {

        },
      })
    }
  }

  navigativePageCreatePartner() {
    this.router.navigate(['/companies/create']);
  }
  showModalAdd() {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.titleFormPartner = 'Thêm đối tác mới';
    this.formAdd.reset();
    this.formAdd.patchValue({
      id: 0,
      userId: 0,
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

  showModalUpdate(data: any) {
    this.isVisibleAdd = true;
    this.submitted = false;
    this.item = data;
    this.updated = true;
    this.titleFormPartner = 'Sửa thông tin đối tác';
    this.formAdd.patchValue({
      id: this.item.id,
      userId: this.item.userId,
      companyName: this.item.companyName,
      taxCode: this.item.taxCode,
      name: this.item.name,
      phone: this.item.phone,
      email: this.item.email,
      address: this.item.address,
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
        // Tạo mới tài khoản đối tác
        delete formValue.id;
        delete formValue.username;
        delete formValue.password;
        delete formValue.repeatPassword;
        delete formValue.userId;
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
          this.notificationService.showNotification(Constant.ERROR, 'Tạo mới thông tin đối tác thất bại!');
        });
      } else {
        let payload = {
          id: formValue.userId,
          fullname: formValue.name,
          username: formValue.username,
          email: formValue.email,
          phoneNo: formValue.phone,
        }
        if (formValue.userId) {
          this.generalService.updateUser(payload).subscribe(res => {
            if (res && res.ret && res.ret[0].code !== 0) {
              this.notificationService.showNotification(Constant.ERROR, 'Sửa tài khoản đối tác thất bại');
            } else {
              this.notificationService.showNotification(Constant.SUCCESS, 'Sửa tài khoản đối tác thành công');
            }
          });
        }

        delete formValue.userId;
        delete formValue.username;
        delete formValue.password;
        delete formValue.repeatPassword;
        this.generalService.updatePartner(formValue).subscribe((res: any) => {
          if (res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
          } else {
            this.getListData();
            this.isVisibleAdd = false;
            this.notificationService.showNotification(Constant.SUCCESS, 'Sửa thông tin đối tác thành công');
          }
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, 'Sửa thông tin đối tác thất bại!');
        });
      }
    }
  }

  handleCancelPassword() {
    this.isVisiblePassword = false;
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

  showModalAccount(data: any) {
    this.isVisibleAddAccount = true;
    this.formAccount.patchValue({
      userId: data.userId,
      partnerId: data.id,
      fullname: data.name,
      email: data.email,
      username: data.email,
      password: "",
      repeatPassword: "",
    });
    if (data.username) this.isEnableUsername = true
    else this.isEnableUsername = false;
  }

  handleOkAddAccount() {
    const formValue = this.formAccount.value;
    if (!this.isEnableUsername) {
      let payloadPostAccountForPartner = {
        partnerId: formValue.partnerId,
        username: formValue.username,
        password: formValue.password,
        repeatPassword: formValue.repeatPassword,
      }
      this.generalService.postAccountForPartner(payloadPostAccountForPartner).subscribe((res: any) => {
        if (!res.isValid) {
          this.notificationService.showNotification(
            Constant.ERROR,
            res.errors[0].errorMessage
          );
        } else {
          this.isVisibleAddAccount = false;
          this.notificationService.showNotification(
            Constant.SUCCESS,
            Constant.MESSAGE_ADD_SUCCESS
          );
          this.formAccount.reset();
        }
      }).add(() => { this.getListData(); });
    } else {
      let userId = formValue.userId;
      let payloadChangeUserPassword = {
        password: formValue.password,
        repeatPassword: formValue.repeatPassword,
      }
      this.generalService.changeUserPassword(userId, payloadChangeUserPassword).subscribe(
        (res: any) => {
          res.ret.forEach((element: any) => {
            if (element.code != 0) {
              this.notificationService.showNotification(
                Constant.ERROR,
                element.message
              );
            } else {
              this.isVisibleAddAccount = false;
              this.notificationService.showNotification(
                Constant.SUCCESS,
                'Đổi mật khẩu thành công!'
              );
              this.formAccount.reset();
            }
          });
        }).add(() => { this.getListData(); });;
    }
  }

  toFullPath(filePath: any) {
    return this.configService.getConfig().api.url + '/' + filePath;
  }

  openModalUpload(data: any, type: any) {
    this.selectedResult = data;
    this.visibleUpload = true;
    if (data.partnerFile != null) {
      this.curFileResults = data.partnerFile.filter((obj: any) => {
        return obj.type === type
      });
    }
    const partnerId = data.id;
    this.uploadUrl = `${this.configService.getConfig().api.baseUrl}/Upload/UploadPartnerFile?partnerId=${partnerId}&type=${type}`;
  }

  closeModalUpload() {
    this.visibleUpload = false;
  }

  openPreviewFileResult(event: any, filePath: any) {
    this.previewFileResult = true;
    // this.previewUrl = this.baseImageurl + filename;
    this.previewUrl = this.configService.getConfig().api.url + '/' + filePath;
    event.stopPropagation();
  }

  removeResult(data: any) {
    this.generalService.removeFile(data.id).subscribe((res: any) => {
      this.getListData();
      this.curFileResults = this.curFileResults.filter(en => en.id !== data.id);
    });
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      const file = {
        fileName: info.file.response.fileName,
        filePath: info.file.response.path
      };
      this.newFileResults = [...this.newFileResults, file];
    } else if (info.file.status === 'error') {
      // this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  saveFileResult() {
    if (this.newFileResults.length === 0) {
      this.visibleUpload = false;
    }
    const data = this.selectedResult;
    this.notificationService.showNotification(Constant.SUCCESS, 'Tải lên file đính kèm thành công');
    this.getListData();
    this.visibleUpload = false;
  }

  closePdf() {
    this.previewFileResult = false;
  }

  onResetDebtForPartnerByID(partner: any) {
    this.modalService.confirm({
      nzTitle: `Bạn có chắc muốn thiết lập lại công nợ cho đối tác ${partner.name}?`,
      nzContent: `<b style="color: red;">Công nợ đối tác ${partner.name} sẽ không thể hoàn tác sau khi thiết lập lại. Ấn đồng ý để tiếp tục</b>`,
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.resetDebtForPartnerByID(partner.id),
    });
  }


  resetDebtForPartnerByID(idPartner: any) {
    this.generalService.resetDebtForPartnerByID(idPartner).subscribe({
      next: (res) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Công nợ thiết lập lại thành công');
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Công nợ thiết lập lại không thành công');
      },

      complete: () => {
        this.getListData();
      }
    });
  }

  formatCurrencyVND(value) {
    if (!value) {
      return '0 đ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }
}
