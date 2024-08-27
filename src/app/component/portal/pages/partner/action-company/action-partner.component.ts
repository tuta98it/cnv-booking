import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { MENU_CREATE_PARTNER_OPTION, MenuCreatePartner } from 'src/app/enums/menu-create-partner.enum';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { NZTableSettingCustoms } from 'src/app/Interfaces/nz-table-seting.interface';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';
import { AllowDebtPartner } from 'src/app/shared/constants/allow-debt-partner.class';
import { PARTNER_STATUS_OPTIONS, PartnerStatus } from 'src/app/enums/partner-status.enum';
import { UploadFileSetting } from 'src/app/Interfaces/upload-file-setting.interface';
import { AppConfigService } from 'src/app-config.service';
import { TypeOfDocument } from 'src/app/enums/type-of-document.enum';
import { Constant } from 'src/app/shared/constants/constant.class';
import { GeneralService } from './../../../../../service/general-service';
import { NotificationService } from 'src/app/service/notification.service';
import { BusinessServiceType } from 'src/app/enums/business-service-type';
import { PaymentPeriod, PAYMENT_PERIOD_VHL_OPTIONS, PAYMENT_PERIOD_FULL_OPTIONS } from 'src/app/enums/payment-period.enum';
import { Weekdays, WEEKDAYS_OPTIONS } from 'src/app/enums/weekdays.enum';
import { DAYS_OF_MONTH_OPTIONS, DaysOfMonth } from 'src/app/enums/days-of-month.enum';
import { MONTHS_OPTIONS, MonthsOfTheYear } from 'src/app/enums/months-of-the-year.enum';
import { UserType } from 'src/app/enums/user-type.enum';

interface ItemData {
  name: string;
  age: number | string;
  address: string;
  checked: boolean;
  expand: boolean;
  description: string;
  disabled?: boolean;
}

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-action-partner',
  templateUrl: './action-partner.component.html',
  styleUrls: ['./action-partner.component.scss']
})
export class ActionPartnerComponent implements OnInit {
  ActionTypePageVHL = ActionTypePageVHL;
  MenuCreatePartner = MenuCreatePartner;
  MENU_CREATE_PARTNER_OPTION = MENU_CREATE_PARTNER_OPTION;
  PartnerStatus = PartnerStatus;
  PARTNER_STATUS_OPTIONS = PARTNER_STATUS_OPTIONS;
  AllowDebtPartner = AllowDebtPartner;
  selectedMenu = MenuCreatePartner.ContractManagement;
  PaymentPeriod = PaymentPeriod;
  PAYMENT_PERIOD_VHL_OPTIONS = PAYMENT_PERIOD_VHL_OPTIONS;
  PAYMENT_PERIOD_FULL_OPTIONS = PAYMENT_PERIOD_FULL_OPTIONS;
  Weekdays = Weekdays;
  WEEKDAYS_OPTIONS = WEEKDAYS_OPTIONS;
  DaysOfMonth = DaysOfMonth;
  DAYS_OF_MONTH_OPTIONS = DAYS_OF_MONTH_OPTIONS;
  MonthsOfTheYear = MonthsOfTheYear;
  MONTHS_OPTIONS = MONTHS_OPTIONS;
  PAYMENT_PERIOD_DAYS_OPTIONS = [];
  actionPartnerVHL: any;
  settingTableListEmployeesForm: FormGroup;
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingTableEmployeesValue: NZTableSettingCustoms;
  listOfEmployees: readonly ItemData[] = [];
  displayData: readonly ItemData[] = [];
  formBaseInfoCreatePartner: FormGroup;
  formBaseBusinessContractUpdate: FormGroup;
  settingUploadAuthorizationFile: UploadFileSetting;
  settingUploadBusinessLicenseFile: UploadFileSetting;
  settingUploadContractFile: UploadFileSetting;
  listUploadAuthorizationFile: NzUploadFile[];
  listUploadBusinessLicenseFile: NzUploadFile[];
  listUploadContractFile: NzUploadFile[];
  partnerIdInfoBaseReturn?: number;

  listOfOption: string[] = ['a10', 'c12', 'c13'];
  listOfSelectedValue = ['a10', 'c12'];

  checkOptionsBusinessServiceVHL = [
    { label: 'Dịch vụ vé máy bay', value: BusinessServiceType.AirlineTicketBookingService, disabled: false, checked: true },
    { label: 'Dich vụ đặt khách sạn', value: BusinessServiceType.HotelBookingService, disabled: false, checked: false },
  ];
  itemPartner: any = null;
  employees: any;
  isActiveEditBaseInfo: boolean = false;

  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private router: Router,
  ) {

    this.formBaseInfoCreatePartner = this.formBuilder.group({
      id: [null],
      status: new FormControl({ value: PartnerStatus.CreatingProfile, disabled: this.actionPartnerVHL == ActionTypePageVHL.Create }, Validators.required),
      code: new FormControl({ value: null, disabled: false }, Validators.required),
      companyName: new FormControl({ value: null, disabled: false }, Validators.required),
      taxCode: new FormControl({ value: null, disabled: false }, Validators.required),
      phone: new FormControl({ value: null, disabled: false }),
      email: new FormControl({ value: null, disabled: false }),
      address: new FormControl({ value: null, disabled: false }, Validators.required),
      businessOwnerId: new FormControl({ value: null, disabled: false }),
      allowDebt: new FormControl({ value: AllowDebtPartner.ALLOW, disabled: false }, Validators.required),
      // partnerAuthorizationFileIDs: [{ value: [], disabled: false }, Validators.required]
      // debtMax: [null],
      // debtUsed: [null],
      // debtRemain: [null],
    });

    this.formBaseBusinessContractUpdate = this.formBuilder.group({
      partnerBusinessLicenseFileIDs: [null],
      partnerContractFileIDs: [null, [Validators.required]],
      personInChargeId: [null, [Validators.required]],
      startTimeContractDate: [null, [Validators.required]],
      endTimeContractDate: [null, [Validators.required]],
      emailToReceiveInvoice: [null, [Validators.required]],
      paymentPeriodType: [null, [Validators.required]],
      dayOfPeriodType: [null, [Validators.required]],
      debtMax: [null, [Validators.required]],
      warningLimitPrice: [null, [Validators.required]],
      typeOfServices: [null, [Validators.required]],

      positionPersonInCharge: new FormControl({ value: null, disabled: true }),
      phoneNumberPersonInCharge: new FormControl({ value: null, disabled: true }),
      emailPersonInCharge: new FormControl({ value: null, disabled: true }),

    });

    this.settingTableListEmployeesForm = this.formBuilder.group({
      bordered: [false],
      loading: [false],
      pagination: [true],
      sizeChanger: [false],
      title: [false],
      header: [true],
      footer: [false],
      expandable: [true],
      checkbox: [true],
      fixHeader: [false],
      noResult: [false],
      noResultText: 'Danh sách nhân viên đang trống. Hãy nhấn vào “Thêm mới” để tạo mới các tài khoản nhân viên cho doanh nghiệp',
      ellipsis: [false],
      simple: [false],
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'unset' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'bottom' as NzTablePaginationPosition
    });
  }

  ngAfterViewInit() {
    this.settingTableEmployeesValue = this.settingTableListEmployeesForm.value as NZTableSettingCustoms;
    this.actionPartnerVHL = this.activatedRoute.snapshot.data['type'];
    this.setIsActiveEditBaseInfo(true);
    this.listOfEmployees = [];
    this.listUploadAuthorizationFile = [];
    this.listUploadBusinessLicenseFile = [];
    this.listUploadContractFile = [];
    if (this.actionPartnerVHL == ActionTypePageVHL.Create) {
      this.settingUploadAuthorizationFile = {
        isMultiple: true,
        action: `${this.configService.getConfig().api.baseUrl}/Upload/UploadPartnerFile?partnerId=null&type=${TypeOfDocument.AuthorizationFile}`,
        header: {
          Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
        },
        name: `postedFile`,
        showUploadList: {
          showPreviewIcon: true,
          showDownloadIcon: true,
          showRemoveIcon: true
        }
      } as UploadFileSetting;

      this.settingUploadBusinessLicenseFile = {
        isMultiple: true,
        action: `${this.configService.getConfig().api.baseUrl}/Upload/UploadPartnerFile?partnerId=null&type=${TypeOfDocument.BusinessLicenseFile}`,
        header: {
          Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
        },
        name: `postedFile`,
        showUploadList: {
          showPreviewIcon: true,
          showDownloadIcon: true,
          showRemoveIcon: true
        }
      } as UploadFileSetting;

      this.settingUploadContractFile = {
        isMultiple: true,
        action: `${this.configService.getConfig().api.baseUrl}/Upload/UploadPartnerFile?partnerId=null&type=${TypeOfDocument.ContractFile}`,
        header: {
          Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
        },
        name: `postedFile`,
        showUploadList: {
          showPreviewIcon: true,
          showDownloadIcon: true,
          showRemoveIcon: true
        }
      } as UploadFileSetting;
    } else if (this.actionPartnerVHL == ActionTypePageVHL.Update) {
      this.setIsActiveEditBaseInfo(true);
      this.activatedRoute.queryParams.subscribe(async params => {
        let idPartner = +params['id']; // Lấy id từ query parameter

        this.settingUploadAuthorizationFile = {
          isMultiple: true,
          action: `${this.configService.getConfig().api.baseUrl}/Upload/UploadPartnerFile?partnerId=${idPartner}&type=${TypeOfDocument.AuthorizationFile}`,
          header: {
            Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
          },
          name: `postedFile`,
          showUploadList: {
            showPreviewIcon: true,
            showDownloadIcon: true,
            showRemoveIcon: true
          }
        } as UploadFileSetting;

        this.settingUploadBusinessLicenseFile = {
          isMultiple: true,
          action: `${this.configService.getConfig().api.baseUrl}/Upload/UploadPartnerFile?partnerId=${idPartner}&type=${TypeOfDocument.BusinessLicenseFile}`,
          header: {
            Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
          },
          name: `postedFile`,
          showUploadList: {
            showPreviewIcon: true,
            showDownloadIcon: true,
            showRemoveIcon: true
          }
        } as UploadFileSetting;

        this.settingUploadContractFile = {
          isMultiple: true,
          action: `${this.configService.getConfig().api.baseUrl}/Upload/UploadPartnerFile?partnerId=${idPartner}&type=${TypeOfDocument.ContractFile}`,
          header: {
            Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
          },
          name: `postedFile`,
          showUploadList: {
            showPreviewIcon: true,
            showDownloadIcon: true,
            showRemoveIcon: true
          }
        } as UploadFileSetting;

        this.itemPartner = await this.getPartnerById(idPartner).catch((reject) => {
          this.notificationService.showNotification(Constant.ERROR, `Lỗi truy vận dữ liệu doanh nghiệp`);
          this.router.navigate([['/companies']]);
        });
        this.resetFormBaseInfoCreatePartner(this.itemPartner);
        this.resetFormContractUpdatePartner(this.itemPartner);

        this.getUsersByPartnerId(this.itemPartner?.id).then((result: any) => {
          this.listOfEmployees = result;
        });
      });
    }
  }

  ngOnInit(): void {
    // Lấy giá trị status từ route data
    this.settingTableListEmployeesForm.valueChanges.subscribe(value => {
      this.settingTableEmployeesValue = value as NZTableSettingCustoms;
    });
    this.settingTableListEmployeesForm.controls.tableScroll.valueChanges.subscribe(scroll => {
      this.fixedColumn = scroll === 'fixed';
      this.scrollX = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    });
    this.settingTableListEmployeesForm.controls.fixHeader.valueChanges.subscribe(fixed => {
      this.scrollY = fixed ? '240px' : null;
    });
    this.settingTableListEmployeesForm.controls.noResult.valueChanges.subscribe(async empty => {
      if (empty) {
        this.listOfEmployees = [];
      } else {
        this.getUsersByPartnerId(this.itemPartner?.id).then((result: any) => {
          this.listOfEmployees = result;
        });
      }
    });
    this.getEmployees();
  }

  private async resetFormBaseInfoCreatePartner(itemPartner: any) {
    this.formBaseInfoCreatePartner.reset({
      status: { value: this.itemPartner?.status || PartnerStatus.CreatingProfile, disabled: this.actionPartnerVHL == ActionTypePageVHL.Create },
      code: this.itemPartner?.code || null,
      companyName: this.itemPartner?.companyName || null,
      taxCode: this.itemPartner?.taxCode || null,
      phone: this.itemPartner?.phone || null,
      email: this.itemPartner?.email || null,
      address: this.itemPartner?.address || null,
      businessOwnerId: this.itemPartner?.businessOwnerId || null,
      allowDebt: this.itemPartner?.allowDebt || AllowDebtPartner.ALLOW
    });

    this.listUploadAuthorizationFile = [];
    //console.log('partnerFiles : ', itemPartner.partnerFiles);
    let partnerAuthorizationFiles = await itemPartner.partnerFiles.filter((f: { type: TypeOfDocument }) => f.type == TypeOfDocument.AuthorizationFile);
    //console.log('partnerAuthorizationFiles : ', partnerAuthorizationFiles);
    for (const partnerFile of partnerAuthorizationFiles) {
      const objPartner = {
        uid: partnerFile.id.toString(),
        name: partnerFile.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${partnerFile.filePath}`,
      }
      this.listUploadAuthorizationFile.push(objPartner)
    }
  }

  private async resetFormContractUpdatePartner(itemPartner: any) {
    this.formBaseBusinessContractUpdate.reset({
      // partnerBusinessLicenseFileIDs: this.itemPartner?.partnerBusinessLicenseFileIDs,
      // partnerContractFileIDs: this.itemPartner?.partnerContractFileIDs,
      personInChargeId: itemPartner?.personInChargeId,
      startTimeContractDate: itemPartner?.startTimeContractDate,
      endTimeContractDate: itemPartner?.endTimeContractDate,
      emailToReceiveInvoice: itemPartner?.emailToReceiveInvoice,
      paymentPeriodType: itemPartner?.paymentPeriodType,
      dayOfPeriodType: itemPartner?.dayOfPeriodType,
      debtMax: itemPartner?.debtMax,
      warningLimitPrice: itemPartner?.warningLimitPrice,
      typeOfServices: itemPartner?.typeOfServices,
      positionPersonInCharge: { value: itemPartner?.positionPersonInCharge, disabled: true },
      phoneNumberPersonInCharge: { value: itemPartner?.phoneNumberPersonInCharge, disabled: true },
      emailPersonInCharge: { value: itemPartner?.emailPersonInCharge, disabled: true }
    });

    this.listUploadBusinessLicenseFile = [];
    const partnerBusinessLicenseFiles = await itemPartner.partnerFiles.filter((f: { type: TypeOfDocument }) => f.type == TypeOfDocument.BusinessLicenseFile);
    for (const partnerFile of partnerBusinessLicenseFiles) {
      const objPartner = {
        uid: partnerFile.id.toString(),
        name: partnerFile.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${partnerFile.filePath}`,
      }
      this.listUploadBusinessLicenseFile.push(objPartner)
    }
    this.listUploadContractFile = [];
    const partnerContractFileFiles = await itemPartner.partnerFiles.filter((f: { type: TypeOfDocument }) => f.type == TypeOfDocument.ContractFile);
    for (const partnerFile of partnerContractFileFiles) {
      const objPartner = {
        uid: partnerFile.id.toString(),
        name: partnerFile.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${partnerFile.filePath}`,
      }
      this.listUploadContractFile.push(objPartner);
    }
  }

  private getPartnerById(partnerId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.generalService.getPartnerById(partnerId).subscribe((res: any) => {
        if (res) {

          resolve(res);
        } else {
          reject("Không tìm thấy doanh nghiệp này");
        }
      }, error => {
        reject(error)
      });
    });
  }

  private getEmployees() {
    this.generalService.queryByUserType({ userType: UserType.All }).subscribe((res: any) => {
      if (res !== null) {
        let stt = 0;
        this.employees = res;
        this.employees.forEach(en => {
          stt++;
          en.stt = stt;
          en.checked = true;
        });
      }
    }, error => {
    });
  }


  private getUsersByPartnerId(idPartner: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.generalService.getUsersByPartnerId(idPartner).subscribe((res: any) => {
        if (res.isValid) {
          let stt = 0;
          res.data.forEach(en => {
            stt++;
            en.stt = stt;
            en.checked = true;
          });
          resolve(res.data);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Lấy ra danh sách nhân viên doanh nghiệp không thành công');
          }
          reject(res.errors);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'TLấy ra danh sách nhân viên doanh nghiệp thất bại do lỗi hệ thống');
        reject(error);
      });
    });

  }


  generateData(): readonly ItemData[] {
    const data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        name: 'John Brown',
        age: `${i}2`,
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
        checked: false,
        expand: false
      });
    }
    return data;
  }


  currentPageDataChange($event: readonly ItemData[]): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }


  handleChangeUploadAuthorizationFile(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {

    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file tải lên thành công`);
      this.listUploadAuthorizationFile = info.fileList;
      setTimeout(() => {
        if (this.listUploadAuthorizationFile.length > 0) {
          this.listUploadAuthorizationFile[this.listUploadAuthorizationFile.length - 1].uid = info.file.response.uid.toString();
          this.listUploadAuthorizationFile[this.listUploadAuthorizationFile.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`;
        }
      }, 200);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file tải lên thất bại.`);
    }
  }

  handleChangeUploadContractFile(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {

    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file tải lên thành công`);
      this.listUploadContractFile = info.fileList;
      setTimeout(() => {
        if (this.listUploadContractFile.length > 0) {
          this.listUploadContractFile[this.listUploadContractFile.length - 1].uid = info.file.response.uid.toString();
          this.listUploadContractFile[this.listUploadContractFile.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`;
        }
      }, 200);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file tải lên thất bại.`);
    }
  }


  handleChangeUploadBusinessLicenseFile(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {

    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file tải lên thành công`);
      this.listUploadBusinessLicenseFile = info.fileList;
      setTimeout(() => {
        if (this.listUploadBusinessLicenseFile.length > 0) {
          this.listUploadBusinessLicenseFile[this.listUploadBusinessLicenseFile.length - 1].uid = info.file.response.uid.toString();
          this.listUploadBusinessLicenseFile[this.listUploadBusinessLicenseFile.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`;
        }
      }, 200);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file tải lên thất bại.`);
    }
  }


  handleRemoveUploadAuthorizationFile(file: NzUploadFile) {
    if (file?.uid) {
      this.generalService.removeFile(file.uid).subscribe({
        next: (res: any) => {
          if (res) {
            if (res.ret && res.ret.length > 0) {
              res.ret.forEach((el: any) => {
                if (el.code === 0) {
                  this.listUploadAuthorizationFile = this.listUploadAuthorizationFile.filter(en => en.uid !== file.uid);
                  this.msg.success(`Đã xoá file ${file.name}.`);
                } else if (res.code === 404) {
                  this.msg.error(`Không tìm thấy file ${file.name}.`);
                } else {
                  this.msg.error(`Đã có lỗi xảy ra. Không thể xoá file ${file.name}`);
                }
              });
            }
          } else {
            this.msg.error(`Xoá file ${file.name} thất bại.`);
          }
        },
        error: (error: any) => {
          this.msg.error(`Lỗi hệ thống, Không thể xoá file ${file.name}`);
        },
        complete: () => {

        }
      });
    }
  }

  handleRemoveUploadContractFile(file: NzUploadFile) {
    if (file?.uid) {
      this.generalService.removeFile(file.uid).subscribe({
        next: (res: any) => {
          if (res) {
            if (res.ret && res.ret.length > 0) {
              res.ret.forEach((el: any) => {
                if (el.code === 0) {
                  this.listUploadContractFile = this.listUploadContractFile.filter(en => en.uid !== file.uid);
                  this.msg.success(`Đã xoá file ${file.name}.`);
                } else if (res.code === 404) {
                  this.msg.error(`Không tìm thấy file ${file.name}.`);
                } else {
                  this.msg.error(`Đã có lỗi xảy ra. Không thể xoá file ${file.name}`);
                }
              });
            }
          } else {
            this.msg.error(`Xoá file ${file.name} thất bại.`);
          }
        },
        error: (error: any) => {
          this.msg.error(`Lỗi hệ thống, Không thể xoá file ${file.name}`);
        },
        complete: () => {

        }
      });
    }
  }


  handleRemoveUploadBusinessLicenseFile(file: NzUploadFile) {
    if (file?.uid) {
      this.generalService.removeFile(file.uid).subscribe({
        next: (res: any) => {
          if (res) {
            if (res.ret && res.ret.length > 0) {
              res.ret.forEach((el: any) => {
                if (el.code === 0) {
                  this.listUploadBusinessLicenseFile = this.listUploadBusinessLicenseFile.filter(en => en.uid !== file.uid);
                  this.msg.success(`Đã xoá file ${file.name}.`);
                } else if (res.code === 404) {
                  this.msg.error(`Không tìm thấy file ${file.name}.`);
                } else {
                  this.msg.error(`Đã có lỗi xảy ra. Không thể xoá file ${file.name}`);
                }
              });
            }
          } else {
            this.msg.error(`Xoá file ${file.name} thất bại.`);
          }
        },
        error: (error: any) => {
          this.msg.error(`Lỗi hệ thống, Không thể xoá file ${file.name}`);
        },
        complete: () => {

        }
      });
    }
  }


  saveBaseInfoPartner() {

    if (this.formBaseInfoCreatePartner.valid) {
      let valueSave = this.formBaseInfoCreatePartner.value;
      let listPartnerAuthorizationFileIDs = this.listUploadAuthorizationFile.map((t) => t.uid);
      valueSave.partnerAuthorizationFileIDs = listPartnerAuthorizationFileIDs;

      if (this.itemPartner?.id) {
        this.generalService.updateBaseInfoById(valueSave, this.itemPartner?.id).subscribe((res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật thông tin doanh nghiệp thành công`);
            this.itemPartner = res.data;
            this.setIsActiveEditBaseInfo(this.itemPartner?.id == null);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin doanh nghiệp không thành công');
            }
          }
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin đối tác thất bại do lỗi hệ thống');
        });
      } else {
        this.generalService.addBaseInfoPartner(valueSave).subscribe((res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `Tạo mới thông tin doanh nghiệp thành công`);
            this.itemPartner = res.data;
            this.setIsActiveEditBaseInfo(this.itemPartner?.id == null);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Tạo mới thông tin doanh nghiệp không thành công');
            }
          }
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, 'Tạo mới thông tin đối tác thất bại do lỗi hệ thống');
        });
      }

    } else {
      // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
      this.formBaseInfoCreatePartner.markAllAsTouched();
      // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
      this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
    }
  }

  editBaseInfoPartner() {
    this.setIsActiveEditBaseInfo(true);
  }

  private setIsActiveEditBaseInfo(value: boolean) {
    this.isActiveEditBaseInfo = value;
    if (this.isActiveEditBaseInfo) {
      this.formBaseInfoCreatePartner.enable();
      if (this.actionPartnerVHL == ActionTypePageVHL.Create) {
        this.formBaseInfoCreatePartner.controls['status'].disable();
      }
    } else {
      this.formBaseInfoCreatePartner.disable();
    }
  }

  cancelBaseInfoPartner() {
    this.setIsActiveEditBaseInfo(true);
    this.resetFormBaseInfoCreatePartner(this.itemPartner);
  }

  cancelPageActionPartner() {
    this.cancelBaseInfoPartner();
    this.cancelUpdateContractInfoForPartner();
    this.router.navigate(['/companies'])
  }

  changeValuePaymentPeriod(value: any) {
    switch (value) {
      case PaymentPeriod.WEEK:
        this.PAYMENT_PERIOD_DAYS_OPTIONS = WEEKDAYS_OPTIONS;
        break;

      case PaymentPeriod.MONTH:
        this.PAYMENT_PERIOD_DAYS_OPTIONS = DAYS_OF_MONTH_OPTIONS.filter((day: any) => day.value >= DaysOfMonth.ONE && day.value <= DaysOfMonth.TWENTY_EIGHT);
        break;

      default:
        this.PAYMENT_PERIOD_DAYS_OPTIONS = [];
        break;
    }
  }


  async onSelectPersonInCharge(employeeId: any) {
    try {
      const itemEmployee = await this.getEmployeeById(employeeId);
      this.formBaseBusinessContractUpdate.controls['positionPersonInCharge'].setValue(itemEmployee?.position ?? "");
      this.formBaseBusinessContractUpdate.controls['phoneNumberPersonInCharge'].setValue(itemEmployee?.phoneNo ?? "");
      this.formBaseBusinessContractUpdate.controls['emailPersonInCharge'].setValue(itemEmployee?.email ?? "");
    } catch (error) {
      this.msg.error("Error fetching employee data: ", error);
    }
  }

  private getEmployeeById(employeeId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.generalService.getUserById(employeeId).subscribe((res: any) => {
        if (res) {
          resolve(res);
        } else {
          reject("No employee found");
        }
      }, error => {
        reject(error)
      });
    });

  }

  saveUpdateContractInfoForPartner() {
    let partnerBusinessLicenseFileIds = this.listUploadBusinessLicenseFile?.map((bl: any) => bl.uid) ?? null;
    this.formBaseBusinessContractUpdate.controls['partnerBusinessLicenseFileIDs'].setValue(partnerBusinessLicenseFileIds);

    let partnerContractFileIds = this.listUploadContractFile?.map((bl: any) => bl.uid) ?? null;
    this.formBaseBusinessContractUpdate.controls['partnerContractFileIDs'].setValue(partnerContractFileIds);

    let partnerTypeOfServices = this.checkOptionsBusinessServiceVHL?.filter(option => option.checked).map(option => option.value) ?? null;
    this.formBaseBusinessContractUpdate.controls['typeOfServices'].setValue(JSON.stringify(partnerTypeOfServices));

    if (this.formBaseBusinessContractUpdate.valid) {
      let valueSave = this.formBaseBusinessContractUpdate.value;
      if (this.itemPartner?.id) {
        this.generalService.updateContractInfoForPartner(this.itemPartner?.id, valueSave).subscribe((res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật thông tin hợp đồng doan nghiệp thành công`);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin hợp đồng doan nghiệp không thành công');
            }
          }
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin hợp đồng doan nghiệp thất bại do lỗi hệ thống');
        });
      } else {
        this.msg.error(`Doanh nghiệp không tồn tại`);
      }

    } else {
      // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
      this.formBaseInfoCreatePartner.markAllAsTouched();
      // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
      this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
    }
  }

  cancelUpdateContractInfoForPartner() {
    this.formBaseBusinessContractUpdate.reset();
  }
}
