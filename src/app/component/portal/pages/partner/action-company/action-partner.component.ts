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
  settingUploadAuthorizationFile: UploadFileSetting;
  listUploadAuthorizationFile: NzUploadFile[];
  partnerIdInfoBaseReturn?: number;

  listOfOption: string[] = ['a10', 'c12', 'c13'];
  listOfSelectedValue = ['a10', 'c12'];

  checkOptionsBusinessServiceVHL = [
    { label: 'Dịch vụ vé máy bay', value: BusinessServiceType.AirlineTicketBookingService, disabled: false, checked: true },
    { label: 'Dich vụ đặt khách sạn', value: BusinessServiceType.HotelBookingService, disabled: false, checked: false },
  ];
  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.actionPartnerVHL = this.activatedRoute.snapshot.data['type'];
    if (this.actionPartnerVHL == ActionTypePageVHL.Create) {
      this.listOfEmployees = [];
      this.listUploadAuthorizationFile = [];
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
    } else if (this.actionPartnerVHL == ActionTypePageVHL.Update) {

    }
    this.formBaseInfoCreatePartner = this.formBuilder.group({
      id: [null],
      status: new FormControl({ value: PartnerStatus.CreatingProfile, disabled: this.actionPartnerVHL == ActionTypePageVHL.Create }, Validators.required),
      code: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      taxCode: [null, [Validators.required]],
      phone: [null],
      email: [null],
      address: [null, [Validators.required]],
      businessOwnerId: [null],
      allowDebt: [AllowDebtPartner.ALLOW, [Validators.required]],
      partnerAuthorizationFileIDs: [[]]
      // debtMax: [null],
      // debtUsed: [null],
      // debtRemain: [null],
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

    this.settingTableEmployeesValue = this.settingTableListEmployeesForm.value as NZTableSettingCustoms;
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
    this.settingTableListEmployeesForm.controls.noResult.valueChanges.subscribe(empty => {
      if (empty) {
        this.listOfEmployees = [];
      } else {
        this.listOfEmployees = this.generateData();
      }
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
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file tải lên thành công`);
      this.listUploadAuthorizationFile = info.fileList;
      setTimeout(() => {
        if (this.listUploadAuthorizationFile.length > 0) {
          this.listUploadAuthorizationFile[this.listUploadAuthorizationFile.length - 1].partnerFileId = info.file.response.partnerFileId.toString();
          this.listUploadAuthorizationFile[this.listUploadAuthorizationFile.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`;
        }
      }, 200);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file tải lên thất bại.`);
    }
  }

  handleRemoveUploadAuthorizationFile(file: NzUploadFile) {
    if (file?.partnerFileId) {
      this.generalService.removeFile(file.partnerFileId).subscribe({
        next: (res: any) => {
          if (res) {
            if (res.ret && res.ret.length > 0) {
              res.ret.forEach((el: any) => {
                if (el.code === 0) {
                  this.listUploadAuthorizationFile = this.listUploadAuthorizationFile.filter(en => en.partnerFileId !== file.partnerFileId);
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
      let listPartnerAuthorizationFileIDs = this.listUploadAuthorizationFile.map((t) => t.partnerFileId);
      valueSave.partnerAuthorizationFileIDs = listPartnerAuthorizationFileIDs;

      this.generalService.addPartner(valueSave).subscribe((res: any) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, `Tạo mới thông tin doanh nghiệp thành công`);
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
    } else {
      // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
      this.formBaseInfoCreatePartner.markAllAsTouched();
      // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
      this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
    }
  }

  log(value: object[]): void {
    console.log(value);
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
}
