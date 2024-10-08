import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { MENU_UPGRADE_PARTNER_OPTION, MenuUpgradePartner } from 'src/app/enums/menu-upgrade-partner.enum';
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
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents';
import { DatePipe } from '@angular/common';
import { COLOR_USER_STATUS, TEXT_USER_STATUS, USER_STATUS_OPTIONS, UserStatus } from 'src/app/enums/user-status.enum';
import { LockType } from 'src/app/enums/lock-type.enum';
import { NzModalService } from 'ng-zorro-antd/modal';

// interface ItemData {
//   name: string;
//   age: number | string;
//   address: string;
//   checked: boolean;
//   expand: boolean;
//   description: string;
//   disabled?: boolean;
// }

type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-action-partner',
  templateUrl: './action-partner.component.html',
  styleUrls: ['./action-partner.component.scss']
})
export class ActionPartnerComponent implements OnInit {
  Constant = Constant;
  titleActionCompanyPage: string = "Thêm mới doanh nghiệp"
  ActionTypePageVHL = ActionTypePageVHL;
  MenuCreatePartner = MenuUpgradePartner;
  MENU_UPGRADE_PARTNER_OPTION = MENU_UPGRADE_PARTNER_OPTION;
  PartnerStatus = PartnerStatus;
  PARTNER_STATUS_OPTIONS = PARTNER_STATUS_OPTIONS;
  AllowDebtPartner = AllowDebtPartner;
  selectedMenu = MenuUpgradePartner.ContractManagement;
  PaymentPeriod = PaymentPeriod;
  PAYMENT_PERIOD_VHL_OPTIONS = PAYMENT_PERIOD_VHL_OPTIONS;
  PAYMENT_PERIOD_FULL_OPTIONS = PAYMENT_PERIOD_FULL_OPTIONS;
  Weekdays = Weekdays;
  WEEKDAYS_OPTIONS = WEEKDAYS_OPTIONS;
  DaysOfMonth = DaysOfMonth;
  DAYS_OF_MONTH_OPTIONS = DAYS_OF_MONTH_OPTIONS;
  MonthsOfTheYear = MonthsOfTheYear;
  MONTHS_OPTIONS = MONTHS_OPTIONS;

  UserStatus = UserStatus;
  USER_STATUS_OPTIONS = USER_STATUS_OPTIONS;
  TEXT_USER_STATUS = TEXT_USER_STATUS;
  COLOR_USER_STATUS = COLOR_USER_STATUS;

  LockType = LockType;


  PAYMENT_PERIOD_DAYS_OPTIONS = [];
  actionPartnerVHL: any;
  settingTableListEmployeesForm: FormGroup;
  settingTableListBalanceFluctuationForm: FormGroup;
  settingTableBusinessUsageHistoriesForm: FormGroup;
  allCheckedEmployee = false;
  indeterminateEmployee = false;
  allUnCheckedEmployee = false;

  fixedColumnEmployee = false;
  fixedColumnBalanceFluctuation = false;
  fixedColumnBusinessUsageHistory = false;

  scrollXEmployeesValue: string | null = null;
  scrollYEmployeesValue: string | null = null;
  settingTableEmployeesValue: NZTableSettingCustoms;

  scrollXBusinessUsageHistoriesValue: string | null = null;
  scrollYBusinessUsageHistoriesValue: string | null = null;
  settingTableBusinessUsageHistoriesValue: NZTableSettingCustoms;

  scrollXBalanceFluctuationValue: string | null = null;
  scrollYBalanceFluctuationValue: string | null = null;
  settingTableBalanceFluctuationValue: NZTableSettingCustoms;
  listOfEmployees: readonly any[] = [];
  displayDataEmployee: readonly any[] = [];
  formBaseInfoCreatePartner: FormGroup;
  formBaseBusinessContractUpdate: FormGroup;
  settingUploadAuthorizationFile: UploadFileSetting;
  settingUploadBusinessLicenseFile: UploadFileSetting;
  settingUploadContractFile: UploadFileSetting;
  settingUploadEmployeeForPartnerFile: UploadFileSetting;
  listUploadAuthorizationFile: NzUploadFile[];
  listUploadBusinessLicenseFile: NzUploadFile[];
  listUploadEmployeeForPartnerFile: NzUploadFile[];
  listUploadContractFile: NzUploadFile[];
  partnerIdInfoBaseReturn?: number;

  listOfOption: string[] = ['a10', 'c12', 'c13'];
  listOfSelectedValue = ['a10', 'c12'];

  checkOptionsBusinessServiceVHL = [
    { label: 'Dịch vụ vé máy bay', value: BusinessServiceType.AirlineTicketBookingService, disabled: false, checked: false },
    { label: 'Dich vụ đặt khách sạn', value: BusinessServiceType.HotelBookingService, disabled: false, checked: false },
  ];
  itemPartner: any = null;

  employees: any;
  // isActiveEditBaseInfo: boolean = false;

  isActiveEditBaseInfo: FormControl = new FormControl(false);

  searchEmployee: string = '';
  displayDataBalanceFluctuation: readonly any[];
  allUnCheckedBalanceFluctuation: boolean;
  allCheckedBalanceFluctuation: boolean;
  indeterminateBalanceFluctuation: boolean;
  listOfBalanceFluctuations: any[];
  debtBearingSales: any;
  debtFreeRevenue: any;


  isVisibleDepositAccount = false;
  isDepositAccountOkLoading = false;


  valueInputNumberAmount = '';
  tooltipTitleAmount = 'Nhập số tiền';
  isEditBaseBusinessContract: Boolean = false;
  isLockPage: FormControl = new FormControl(false);
  isVisibleChangePassword: boolean = false;
  listOfBusinessUsageHistories: any[];

  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NzModalService,
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
      name: new FormControl({ value: null, disabled: false }),
      // businessOwnerId: new FormControl({ value: null, disabled: false }),
      allowDebt: new FormControl({ value: AllowDebtPartner.ALLOW, disabled: false }, Validators.required),
      // partnerAuthorizationFileIDs: [{ value: [], disabled: false }, Validators.required]
      // debtMax: [null],
      // debtUsed: [null],
      // debtRemain: [null],
    });

    this.formBaseBusinessContractUpdate = this.formBuilder.group({
      partnerBusinessLicenseFileIDs: [null],
      partnerContractFileIDs: new FormControl({ value: null, disabled: true }, Validators.required),
      startTimeContractDate: new FormControl({ value: null, disabled: true }, Validators.required),
      endTimeContractDate: new FormControl({ value: null, disabled: true }, Validators.required),
      emailToReceiveInvoice: new FormControl({ value: null, disabled: true }, Validators.required),
      paymentPeriodType: new FormControl({ value: null, disabled: true }, Validators.required),
      dayOfPeriodType: new FormControl({ value: null, disabled: true }, Validators.required),
      debtMax: [{ value: null, disabled: true }, [this.formBaseInfoCreatePartner.get('allowDebt')?.value == AllowDebtPartner.ALLOW ? Validators.required : Validators.nullValidator]],
      warningLimitPrice: [{ value: null, disabled: true }, [this.formBaseInfoCreatePartner.get('allowDebt')?.value == AllowDebtPartner.ALLOW ? Validators.required : Validators.nullValidator]],

      typeOfServices: new FormControl({ value: null, disabled: true }, Validators.required),

      personInChargeId: [null],
      namePersonInCharge: new FormControl({ value: null, disabled: true }, Validators.required),
      positionPersonInCharge: new FormControl({ value: null, disabled: true }, Validators.required),
      phoneNumberPersonInCharge: new FormControl({ value: null, disabled: true }, Validators.required),
      emailPersonInCharge: new FormControl({ value: null, disabled: true }, Validators.required),
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
      fixHeader: [true],
      noResult: [false],
      noResultText: 'Danh sách nhân viên đang trống. Hãy nhấn vào “Thêm mới” để tạo mới các tài khoản nhân viên cho doanh nghiệp',
      ellipsis: [false],
      simple: [false],
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'scroll' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'bottom' as NzTablePaginationPosition
    });

    this.settingTableListBalanceFluctuationForm = this.formBuilder.group({
      bordered: [false],
      loading: [false],
      pagination: [true],
      sizeChanger: [false],
      title: [false],
      header: [true],
      footer: [false],
      expandable: [true],
      checkbox: [true],
      fixHeader: [true],
      noResult: [false],
      noResultText: 'Danh sách biến động số dư đang trống',
      ellipsis: [false],
      simple: [false],
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'unset' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'bottom' as NzTablePaginationPosition
    });

    this.settingTableBusinessUsageHistoriesForm = this.formBuilder.group({
      bordered: [false],
      loading: [false],
      pagination: [true],
      sizeChanger: [false],
      title: [false],
      header: [true],
      footer: [false],
      expandable: [true],
      checkbox: [true],
      fixHeader: [true],
      noResult: [false],
      noResultText: 'Danh sách lịch sử sử dụng đang trống',
      ellipsis: [false],
      simple: [false],
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'scroll' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'bottom' as NzTablePaginationPosition
    });

  }

  ngAfterViewInit() {
    this.settingTableEmployeesValue = this.settingTableListEmployeesForm.value as NZTableSettingCustoms;
    this.settingTableBalanceFluctuationValue = this.settingTableListBalanceFluctuationForm.value as NZTableSettingCustoms;
    this.settingTableBusinessUsageHistoriesValue = this.settingTableBusinessUsageHistoriesForm.value as NZTableSettingCustoms;

    this.actionPartnerVHL = this.activatedRoute.snapshot.data['type'];
    // this.setIsActiveEditBaseInfo(true);


    this.listOfEmployees = [];
    this.listUploadAuthorizationFile = [];
    this.listUploadBusinessLicenseFile = [];
    this.listUploadContractFile = [];
    this.listUploadEmployeeForPartnerFile = [];
    if (this.actionPartnerVHL == ActionTypePageVHL.Create) {
      //this.isActiveEditBaseInfo.setValue(true);
      this.titleActionCompanyPage = "Thêm mới doanh nghiệp";
      this.isActiveEditBaseInfo.setValue(true);
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

      this.settingUploadEmployeeForPartnerFile = {
        isMultiple: false,
        action: `${this.configService.getConfig().api.baseUrl}/api/ImportExcel/ImportEmployeeForPartner?PartnerId=null`,
        header: {
          Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
        },
        name: `postedFile`,
        showUploadList: {
          showPreviewIcon: false,
          showDownloadIcon: false,
          showRemoveIcon: false
        }
      } as UploadFileSetting;

      this.listOfEmployees = [];
    } else if (this.actionPartnerVHL == ActionTypePageVHL.Update) {
      // this.setIsActiveEditBaseInfo(true);
      //this.isActiveEditBaseInfo.setValue(true);
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

        this.settingUploadEmployeeForPartnerFile = {
          isMultiple: false,
          action: `${this.configService.getConfig().api.baseUrl}/api/ImportExcel/ImportEmployeeForPartner?PartnerId=${idPartner}`,
          header: {
            Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
          },
          name: `postedFile`,
          showUploadList: {
            showPreviewIcon: false,
            showDownloadIcon: false,
            showRemoveIcon: false
          }
        } as UploadFileSetting;
        this.itemPartner = await this.getPartnerById(idPartner).catch((reject) => {
          this.notificationService.showNotification(Constant.ERROR, `Lỗi truy vấn dữ liệu doanh nghiệp`);
          this.router.navigate([['/companies']]);
        });
        this.titleActionCompanyPage = this.itemPartner?.companyName ?? "";
        this.setActionPageByStatus(this.itemPartner?.status);
        this.resetFormBaseInfoCreatePartner(this.itemPartner);
        this.resetFormContractUpdatePartner(this.itemPartner);

        this.getEmployeesByPartnerId();


        this.getBalanceFluctuationsByPartnerId(this.itemPartner?.id).then((result: any) => {
          this.debtBearingSales = result.debtBearingSales
          this.debtFreeRevenue = result.debtFreeRevenue
          this.listOfBalanceFluctuations = result.tableAccountBalancies;
          let stt = 0;
          this.listOfBalanceFluctuations.forEach(en => {
            stt++;
            en.stt = stt;
          });
        });

        this.getListBusinessServiceUsageHistoryByPartner(this.itemPartner?.id).then((result: any) => {
          this.listOfBusinessUsageHistories = result;
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
      this.fixedColumnEmployee = scroll === 'fixed';
      this.scrollXEmployeesValue = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    });
    let tableScrollValue = this.settingTableListEmployeesForm.controls['tableScroll'].value;
    this.fixedColumnEmployee = tableScrollValue === 'fixed';
    this.scrollXEmployeesValue = tableScrollValue === 'scroll' || tableScrollValue === 'fixed' ? '100vw' : null;
    this.settingTableListEmployeesForm.controls.fixHeader.valueChanges.subscribe(fixed => {
      this.scrollYEmployeesValue = fixed ? '240px' : null;
    });
    this.scrollYEmployeesValue = this.settingTableListEmployeesForm.controls['fixHeader'].value ? '240px' : null;
    this.settingTableListEmployeesForm.controls.noResult.valueChanges.subscribe(async empty => {
      if (empty) {
        this.listOfEmployees = [];
      } else {
        this.getEmployeesByPartnerId();
      }
    });




    // Lấy giá trị status từ route data
    this.settingTableListBalanceFluctuationForm.valueChanges.subscribe(value => {
      this.settingTableBalanceFluctuationValue = value as NZTableSettingCustoms;
    });
    this.settingTableListBalanceFluctuationForm.controls.tableScroll.valueChanges.subscribe(scroll => {
      this.fixedColumnBalanceFluctuation = scroll === 'fixed';
      this.scrollXBalanceFluctuationValue = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    });
    let tableScrollBalanceFluctuationValue = this.settingTableListBalanceFluctuationForm.controls['tableScroll'].value;
    this.fixedColumnBalanceFluctuation = tableScrollBalanceFluctuationValue === 'fixed';
    this.scrollXBalanceFluctuationValue = tableScrollBalanceFluctuationValue === 'scroll' || tableScrollBalanceFluctuationValue === 'fixed' ? '100vw' : null;


    this.settingTableListBalanceFluctuationForm.controls.fixHeader.valueChanges.subscribe(fixed => {
      this.scrollYBalanceFluctuationValue = fixed ? '175px' : null;
    });
    this.scrollYBalanceFluctuationValue = this.settingTableListBalanceFluctuationForm.controls['fixHeader'].value ? '175px' : null;


    this.settingTableListBalanceFluctuationForm.controls.noResult.valueChanges.subscribe(async empty => {
      if (empty) {
        this.listOfBalanceFluctuations = [];
        this.debtBearingSales = null;
        this.debtFreeRevenue = null;
      } else {
        this.getBalanceFluctuationsByPartnerId(this.itemPartner?.id).then((result: any) => {
          this.debtBearingSales = result.debtBearingSales
          this.debtFreeRevenue = result.debtFreeRevenue
          this.listOfBalanceFluctuations = result.tableAccountBalancies;
          let stt = 0;
          this.listOfBalanceFluctuations.forEach(en => {
            stt++;
            en.stt = stt;
          });
        });
      }
    });



    // Lấy giá trị status từ route data
    this.settingTableBusinessUsageHistoriesForm.valueChanges.subscribe(value => {
      this.settingTableBusinessUsageHistoriesValue = value as NZTableSettingCustoms;
    });
    this.settingTableBusinessUsageHistoriesForm.controls.tableScroll.valueChanges.subscribe(scroll => {
      this.fixedColumnBusinessUsageHistory = scroll === 'fixed';
      this.scrollXBusinessUsageHistoriesValue = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    });
    let tableBusinessUsageHistoryScrollValue = this.settingTableBusinessUsageHistoriesForm.controls['tableScroll'].value;
    this.fixedColumnBusinessUsageHistory = tableBusinessUsageHistoryScrollValue === 'fixed';
    this.scrollXBusinessUsageHistoriesValue = tableBusinessUsageHistoryScrollValue === 'scroll' || tableBusinessUsageHistoryScrollValue === 'fixed' ? '100vw' : null;
    this.settingTableBusinessUsageHistoriesForm.controls.fixHeader.valueChanges.subscribe(fixed => {
      this.scrollYBusinessUsageHistoriesValue = fixed ? '240px' : null;
    });
    this.scrollYBusinessUsageHistoriesValue = this.settingTableBusinessUsageHistoriesForm.controls['fixHeader'].value ? '240px' : null;
    this.settingTableBusinessUsageHistoriesForm.controls.noResult.valueChanges.subscribe(async empty => {
      if (empty) {
        this.listOfBusinessUsageHistories = [];
      } else {
        this.getListBusinessServiceUsageHistoryByPartner(this.itemPartner?.id).then((result: any) => {
          this.listOfBusinessUsageHistories = result;
        });
      }
    });


    this.isActiveEditBaseInfo.valueChanges.subscribe((value: any) => {
      if (value == true) {
        this.formBaseInfoCreatePartner.enable();
        // if (this.actionPartnerVHL == ActionTypePageVHL.Create) {
        //   setTimeout(() => {
        //     this.formBaseInfoCreatePartner.controls['status'].disable();
        //   }, 200);
        // }
      } else {
        this.formBaseInfoCreatePartner.disable();

      }
      setTimeout(() => {
        this.formBaseInfoCreatePartner.controls['status'].disable();
      }, 200);
    });


    this.isLockPage.valueChanges.subscribe((value: any) => {
      if (value == true) {
        this.isActiveEditBaseInfo.setValue(false);
        this.changeValueBaseBusinessContractReversal(false)
      } else {
        this.isActiveEditBaseInfo.setValue(true);
        this.changeValueBaseBusinessContractReversal(false)
      }
    });

    this.getEmployees();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemPartner'] && this.itemPartner?.status) {
      this.itemPartner.status.valueChanges.subscribe((status: any) => {
        this.setActionPageByStatus(status);
      });
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    const endValue = this.formBaseBusinessContractUpdate.value.endTimeContractDate;

    if (!startValue || !endValue) {
      return false;
    }

    // Ensure endValue is a Date object
    const endDate = new Date(endValue);
    return startValue.getTime() > endDate.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    const startValue = this.formBaseBusinessContractUpdate.value.startTimeContractDate;
    if (!endValue || !startValue) {
      return false;
    }
    // Ensure endValue is a Date object
    const startDate = new Date(startValue);
    return endValue.getTime() <= startDate.getTime();
  };

  getEmployeesByPartnerId() {
    this.getUsersByPartnerId(this.itemPartner?.id).then((result: any) => {
      this.listOfEmployees = result;
      this.listOfEmployees.forEach(e => {
        e.isLoadingResetPassword = false;
      });
    });
  }

  private setActionPageByStatus(status: any) {
    if (status == PartnerStatus.CreatingProfile) {
      this.isLockPage.setValue(false);
    } else if (status == PartnerStatus.PendingApproval) {
      this.isLockPage.setValue(true);
    } else if (status == PartnerStatus.Active) {
      this.isLockPage.setValue(true);
    } else if (status == PartnerStatus.Locked) {
      this.isLockPage.setValue(true);
    } else {
      this.isActiveEditBaseInfo.setValue(false);
      this.changeValueBaseBusinessContractReversal(false)
    }
  }

  onChangeInputAmount(value: string, controlName?: string): void {
    this.updateValueInputAmount(value, controlName);

  }


  onClickInputAmount(event: any, controlName?: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.valueInputNumberAmount = inputElement.value;

    this.updateValueInputAmount(this.valueInputNumberAmount, controlName);
  }

  // '.' at the end or only '-' in the input box.
  onBlurInputAmount(controlName?: string): void {
    if (this.valueInputNumberAmount.charAt(this.valueInputNumberAmount.length - 1) === '.' || this.valueInputNumberAmount === '-') {
      this.updateValueInputAmount(this.valueInputNumberAmount.slice(0, -1), controlName);
      this.tooltipTitleAmount = "0 đ"
    }
  }


  updateValueInputAmount(value: string, controlName?: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.valueInputNumberAmount = value;
    }

    // Chỉ cập nhật nếu giá trị khác
    if (controlName) {
      const control = this.formBaseBusinessContractUpdate.get(controlName);
      if (control && control.value !== this.valueInputNumberAmount) {
        control.setValue(this.valueInputNumberAmount, { emitEvent: false });
      }
    }
    this.updateTooltipTitleAmount();
  }

  updateTooltipTitleAmount(): void {
    this.tooltipTitleAmount = ((this.valueInputNumberAmount !== '-' ? this.formatNumber(this.valueInputNumberAmount) : '-') || '0') + " đ";
  }

  formatNumber(value: string): string {
    const stringValue = `${value}`;
    const list = stringValue.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
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
      // businessOwnerId: this.itemPartner?.businessOwnerId || null,
      name: this.itemPartner?.name || null,
      allowDebt: this.itemPartner?.allowDebt != null ? this.itemPartner?.allowDebt : AllowDebtPartner.NOT_ALLOW
    });

    this.listUploadAuthorizationFile = [];
    //console.log('partnerFiles : ', itemPartner.partnerFiles);
    let partnerAuthorizationFiles = await itemPartner?.partnerFiles.filter((f: { type: TypeOfDocument }) => f.type == TypeOfDocument.AuthorizationFile);
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
      // positionPersonInCharge: { value: itemPartner?.positionPersonInCharge, disabled: false },
      // phoneNumberPersonInCharge: { value: itemPartner?.phoneNumberPersonInCharge, disabled: false },
      // emailPersonInCharge: { value: itemPartner?.emailPersonInCharge, disabled: false }
    });

    this.onSelectPersonInCharge(itemPartner.personInChargeId);
    // Assuming typeOfServices is a string representation of the array
    const typeOfServices: string = itemPartner.typeOfServices;
    const selectedServices = JSON.parse(typeOfServices) as number[]; // Convert the string to an array of numbers
    // Update checkOptionsBusinessServiceVHL based on selectedServices
    this.checkOptionsBusinessServiceVHL = this.checkOptionsBusinessServiceVHL.map(option => ({
      ...option,
      checked: selectedServices != null ? selectedServices.includes(option.value) : false
    }));

    this.listUploadBusinessLicenseFile = [];
    const partnerBusinessLicenseFiles = await itemPartner?.partnerFiles.filter((f: { type: TypeOfDocument }) => f.type == TypeOfDocument.BusinessLicenseFile);
    for (const partnerFile of partnerBusinessLicenseFiles) {
      const objPartner = {
        uid: partnerFile.id.toString(),
        name: partnerFile.fileName,
        url: `${this.configService.getConfig().api.baseUrl}/${partnerFile.filePath}`,
      }
      this.listUploadBusinessLicenseFile.push(objPartner)
    }
    this.listUploadContractFile = [];
    const partnerContractFileFiles = await itemPartner?.partnerFiles.filter((f: { type: TypeOfDocument }) => f.type == TypeOfDocument.ContractFile);
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
        });
      }
    }, error => {
    });
  }


  private getUsersByPartnerId(idPartner: number): Promise<any> {
    this.settingTableEmployeesValue.loading = true;
    return new Promise((resolve, reject) => {
      this.generalService.getUsersByPartnerId(idPartner).subscribe((res: any) => {
        if (res.isValid) {
          let stt = 0;
          res.data.forEach(en => {
            stt++;
            en.stt = stt;
            en.checked = false;
            en.disabled = (en.status == UserStatus.LOCKED);
            en.isLoadingActiveUser = false;
          });
          resolve(res.data);
          this.settingTableEmployeesValue.loading = false;
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
        this.notificationService.showNotification(Constant.ERROR, 'Lấy ra danh sách nhân viên doanh nghiệp thất bại do lỗi hệ thống');
        reject(error);
      });
    });

  }

  private getBalanceFluctuationsByPartnerId(idPartner: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.settingTableBalanceFluctuationValue.loading = true;
      this.generalService.accountBalanceInformationByPartner(idPartner).subscribe((res: any) => {
        if (res.isValid) {

          this.settingTableBalanceFluctuationValue.loading = false;
          resolve(res.data);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Lấy ra biến động số dư của doanh nghiệp không thành công');
          }
          reject(res.errors);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lấy ra biến động số dư của doanh nghiệp thất bại do lỗi hệ thống');
        reject(error);
      });
    });

  }

  private getListBusinessServiceUsageHistoryByPartner(idPartner: number): Promise<any> {
    this.settingTableBusinessUsageHistoriesValue.loading = true;
    return new Promise((resolve, reject) => {
      this.generalService.getListBusinessServiceUsageHistory({
        partnerId: idPartner,
        startTime: null,
        endTime: null,
        pageNumber: 1,
        pageSize: 1000
      }).subscribe((res: any) => {
        if (res.isValid) {
          let stt = 0;
          res.data.forEach(en => {
            stt++;
            en.stt = stt;
          });
          resolve(res.data);
          this.settingTableBusinessUsageHistoriesValue.loading = false;
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Lấy ra lịch sử sử dụng doanh nghiệp không thành công');
          }
          reject(res.errors);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Lấy ra lịch sử sử dụng doanh nghiệp thất bại do lỗi hệ thống');
        reject(error);
      });
    });

  }

  private updateBalanceFluctuationsBy() {
    this.getBalanceFluctuationsByPartnerId(this.itemPartner?.id).then((result: any) => {
      this.debtBearingSales = result.debtBearingSales
      this.debtFreeRevenue = result.debtFreeRevenue
      this.listOfBalanceFluctuations = result.tableAccountBalancies;
      let stt = 0;
      this.listOfBalanceFluctuations.forEach(en => {
        stt++;
        en.stt = stt;
      });
    });
  }

  currentPageDataChangeEmployee($event: readonly any[]): void {
    this.displayDataEmployee = $event;
    this.refreshStatusEmployee();
  }


  currentPageDataChangeBalanceFluctuation($event: readonly any[]): void {
    this.displayDataBalanceFluctuation = $event;
    this.refreshStatusBalanceFluctuation();
  }

  refreshStatusEmployee(): void {
    const validDataEmployee = this.displayDataEmployee.filter(value => !value.disabled);
    const allCheckedEmployee = validDataEmployee.length > 0 && validDataEmployee.every(value => value.checked === true);
    const allUnCheckedEmployee = validDataEmployee.every(value => !value.checked);
    this.allUnCheckedEmployee = allUnCheckedEmployee;
    this.allCheckedEmployee = allCheckedEmployee;
    this.indeterminateEmployee = !allCheckedEmployee && !allUnCheckedEmployee;
  }

  refreshStatusBalanceFluctuation(): void {
    const validDataBalanceFluctuation = this.displayDataBalanceFluctuation.filter(value => !value.disabled);
    const allCheckedBalanceFluctuation = validDataBalanceFluctuation.length > 0 && validDataBalanceFluctuation.every(value => value.checked === true);
    const allUnCheckedBalanceFluctuation = validDataBalanceFluctuation.every(value => !value.checked);
    this.allUnCheckedBalanceFluctuation = allUnCheckedBalanceFluctuation;
    this.allCheckedBalanceFluctuation = allCheckedBalanceFluctuation;
    this.indeterminateBalanceFluctuation = !allCheckedBalanceFluctuation && !allUnCheckedBalanceFluctuation;
  }

  checkAllEmployees(value: boolean): void {
    this.displayDataEmployee.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatusEmployee();
  }

  onSearchEmployee() {
    const keyword = removeAccents(this.searchEmployee.trim().toLowerCase());
    if (keyword) {
      this.listOfEmployees = this.listOfEmployees.filter((en) =>
        removeAccents(en.fullname?.trim()).toLowerCase().includes(keyword) ||
        removeAccents(en.username?.trim()).toLowerCase().includes(keyword) ||
        removeAccents(en.phoneNo?.trim()).toLowerCase().includes(keyword) ||
        removeAccents(en.email?.trim()).toLowerCase().includes(keyword)
      );
    } else {
      this.getEmployeesByPartnerId();
    }
  }

  handleChangeUploadAuthorizationFile(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {

    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file tải lên thành công`);
      this.listUploadAuthorizationFile = info.fileList;
      setTimeout(() => {
        if (this.listUploadAuthorizationFile.length > 0) {
          this.listUploadAuthorizationFile[this.listUploadAuthorizationFile.length - 1].uid = info.file.response.partnerFileId.toString();
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
          this.listUploadContractFile[this.listUploadContractFile.length - 1].uid = info.file.response.partnerFileId.toString();
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
          this.listUploadBusinessLicenseFile[this.listUploadBusinessLicenseFile.length - 1].uid = info.file.response.partnerFileId.toString();
          this.listUploadBusinessLicenseFile[this.listUploadBusinessLicenseFile.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`;
        }
      }, 200);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file tải lên thất bại.`);
    }
  }

  handleChangeUploadEmployeeForPartnerFile(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {

    }
    if (info.file.status === 'done') {
      this.listUploadEmployeeForPartnerFile = info.fileList;
      setTimeout(() => {
        info.file.response.errors.forEach((error: any) => {
          this.msg.error(`${error?.errorMessage ?? ""}`);
        });
        if (info.file.response.isValid) {
          this.msg.success(`${info.file.name} file tải lên thành công có thề tồn tại một vài nhân viên không đặt yê cầu.`);
        } else {
          this.msg.error(`${info.file.name} file tải đã gặp lỗi hoặc tất các nhân viên không đạt yêu cầu.`);
        }

        // if (this.listUploadEmployeeForPartnerFile.length > 0) {
        //   this.listUploadEmployeeForPartnerFile[this.listUploadEmployeeForPartnerFile.length - 1].uid = info.file.response.partnerFileId.toString();
        //   this.listUploadEmployeeForPartnerFile[this.listUploadEmployeeForPartnerFile.length - 1].url = `${this.configService.getConfig().api.baseUrl}/${info.file.response.path}`;
        // }
      }, 200);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file tải lên thất bại.`);
    }
  }

  handleRemoveUploadAuthorizationFile = (file: NzUploadFile) => {
    if (file?.uid) {
      this.generalService.removeFilePartner(file.uid).subscribe({
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


  handleRemoveUploadContractFile = (file: NzUploadFile) => {
    if (file?.uid) {
      this.generalService.removeFilePartner(file.uid).subscribe({
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


  handleRemoveUploadBusinessLicenseFile = (file: NzUploadFile) => {
    if (file?.uid) {
      this.generalService.removeFilePartner(file.uid).subscribe({
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


  handleRemoveUploadEmployeeForPartner = (file: NzUploadFile) => {
    if (file?.uid) {
      this.generalService.removeFilePartner(file.uid).subscribe({
        next: (res: any) => {
          if (res) {
            if (res.ret && res.ret.length > 0) {
              res.ret.forEach((el: any) => {
                if (el.code === 0) {
                  this.listUploadEmployeeForPartnerFile = this.listUploadEmployeeForPartnerFile.filter(en => en.uid !== file.uid);
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

  saveBaseInfoPartner(): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.formBaseInfoCreatePartner.enable();
      if (this.formBaseInfoCreatePartner.valid) {
        let valueSave = this.formBaseInfoCreatePartner.value;
        let listPartnerAuthorizationFileIDs = this.listUploadAuthorizationFile.map((t) => t.uid);
        valueSave.partnerAuthorizationFileIDs = listPartnerAuthorizationFileIDs;

        if (this.itemPartner?.id) {
          this.generalService.updateBaseInfoById(valueSave, this.itemPartner?.id).subscribe((res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật thông tin doanh nghiệp thành công`);
              this.changeValueBaseBusinessContractReversal(true);
              this.itemPartner = res.data;
              // this.setIsActiveEditBaseInfo(this.itemPartner?.id == null);
              this.isActiveEditBaseInfo.setValue(this.itemPartner?.id == null);

              resolve(true);
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
              // this.setIsActiveEditBaseInfo(this.itemPartner?.id == null);
              this.isActiveEditBaseInfo.setValue(this.itemPartner?.id == null);
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
    })

  }

  editBaseInfoPartner() {
    // this.setIsActiveEditBaseInfo(true);
    this.isActiveEditBaseInfo.setValue(true);
  }

  // private setIsActiveEditBaseInfo(value: boolean) {
  //   this.isActiveEditBaseInfo.setValue(value);
  //   if (this.isActiveEditBaseInfo.value) {
  //     this.formBaseInfoCreatePartner.enable();
  //     if (this.actionPartnerVHL == ActionTypePageVHL.Create) {
  //       this.formBaseInfoCreatePartner.controls['status'].disable();
  //     }
  //   } else {
  //     this.formBaseInfoCreatePartner.disable();
  //   }
  // }

  cancelBaseInfoPartner() {
    // this.setIsActiveEditBaseInfo(true);
    this.isActiveEditBaseInfo.setValue(true);
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
        // this.PAYMENT_PERIOD_DAYS_OPTIONS = DAYS_OF_MONTH_OPTIONS.filter((day: any) => day.value >= DaysOfMonth.ONE && day.value <= DaysOfMonth.TWENTY_EIGHT);
        this.PAYMENT_PERIOD_DAYS_OPTIONS = DAYS_OF_MONTH_OPTIONS;
        break;

      default:
        this.PAYMENT_PERIOD_DAYS_OPTIONS = [];
        break;
    }

    var dayOfPeriodType = this.formBaseBusinessContractUpdate.controls['dayOfPeriodType'].value;
    this.formBaseBusinessContractUpdate.controls['dayOfPeriodType'].setValue(this.PAYMENT_PERIOD_DAYS_OPTIONS[0]?.value ?? 1);
  }


  async onSelectPersonInCharge(employeeId: any) {
    try {
      const itemEmployee = await this.getEmployeeById(employeeId);
      this.formBaseBusinessContractUpdate.controls['namePersonInCharge'].setValue(itemEmployee?.fullname ?? "");
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
    return new Promise((resolve, reject) => {
      let partnerBusinessLicenseFileIds = this.listUploadBusinessLicenseFile?.map((bl: any) => bl.uid) ?? null;
      this.formBaseBusinessContractUpdate.controls['partnerBusinessLicenseFileIDs'].setValue(partnerBusinessLicenseFileIds);

      let partnerContractFileIds = this.listUploadContractFile?.map((bl: any) => bl.uid) ?? null;
      this.formBaseBusinessContractUpdate.controls['partnerContractFileIDs'].setValue(partnerContractFileIds);

      let partnerTypeOfServices = this.checkOptionsBusinessServiceVHL?.filter(option => option.checked).map(option => option.value) ?? null;
      this.formBaseBusinessContractUpdate.controls['typeOfServices'].setValue(JSON.stringify(partnerTypeOfServices));

      if (this.formBaseBusinessContractUpdate.valid) {
        if (this.formBaseInfoCreatePartner.get('allowDebt')?.value == AllowDebtPartner.NOT_ALLOW) {
          this.formBaseBusinessContractUpdate.controls['debtMax'].setValue(null);
          this.formBaseBusinessContractUpdate.controls['warningLimitPrice'].setValue(null);
        }
        let valueSave = this.formBaseBusinessContractUpdate.value;
        if (this.itemPartner?.id) {
          this.generalService.updateContractInfoForPartner(this.itemPartner?.id, valueSave).subscribe((res: any) => {
            if (res.isValid) {
              this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật thông tin hợp đồng doanh nghiệp thành công`);
              this.changeValueBaseBusinessContractReversal();
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
                this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin hợp đồng doanh nghiệp không thành công');
              }
            }
          }, error => {
            this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin hợp đồng doanh nghiệp thất bại do lỗi hệ thống');
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
    });

  }

  changeValueBaseBusinessContractReversal(value?: boolean) {
    if (value != null) {
      this.isEditBaseBusinessContract = value;
    } else {
      this.isEditBaseBusinessContract = !this.isEditBaseBusinessContract
    }
    if (this.isEditBaseBusinessContract) {
      this.formBaseBusinessContractUpdate.enable();
    } else {
      this.formBaseBusinessContractUpdate.disable();
    }
  }

  cancelUpdateContractInfoForPartner() {
    this.formBaseBusinessContractUpdate.reset();
  }

  navigatePage(url: string, typeAction: number, idEmployee?: number) {
    switch (typeAction) {
      case ActionTypePageVHL.Create:
        this.router.navigate([`${url}`], { queryParams: { partnerId: this.itemPartner.id } })
        break;
      case ActionTypePageVHL.Update:
        this.router.navigate([`${url}`], { queryParams: { employeeId: idEmployee, partnerId: this.itemPartner.id } })
        break;
      case ActionTypePageVHL.View:
        this.router.navigate([`${url}`], { queryParams: { employeeId: idEmployee, partnerId: this.itemPartner.id } })
        break;
      default:
        break;
    }
  }
  downloadFileEmployeeForPartnerTemplate() {
    window.open(`${this.configService.getConfig().api.baseUrl}/Uploads/FileMau/file_mau_import_nhan_vien_30082024.xls`, '_blank')
  }

  downloadExcelEmployeeForPartner(partnerId?: number) {
    if (partnerId) {
      this.generalService.downloadExcelEmployeeForPartner(partnerId).subscribe({
        next: (blob) => {
          if (blob) {
            // Create a new Blob object
            const fileUrl = window.URL.createObjectURL(blob);


            // Create a link element to trigger download
            const a = document.createElement('a');
            a.href = fileUrl;

            // Get the current date
            const formattedDate = this.datePipe.transform(new Date(), 'HHmmddMMyy')?.toLowerCase();
            a.download = `DSNV-${this.itemPartner.companyName.replace(/\s/g, "_")}-${formattedDate}.xls`; // You can set the filename here
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            window.URL.revokeObjectURL(fileUrl);
          } else {
            this.notificationService.showNotification(Constant.ERROR, "Tạo file thất bại");

          }
        }
      });
    }
    else {
      this.notificationService.showNotification(Constant.ERROR, "Doanh nghiệp không xác định")
    }
  }


  showLockAccountConfirm(type: LockType, employee?: any): void {
    switch (type) {
      case LockType.SINGLE:
        employee.isLoadingActiveUser = true;
        this.modalService.confirm({
          nzTitle: `<b>Bạn có chắc muốn khoá tài khoản ${employee.username}?</b>`,
          nzContent: 'Ấn đồng ý để tiếp tục',
          nzOkDanger: true,
          nzOkText: 'Đồng ý',
          nzCancelText: 'Không',
          nzOnOk: () => this.lockEmployeeAccount(employee).then(r => this.cancelActiveUserConfirm(employee)),
          nzOnCancel: () => this.cancelActiveUserConfirm(employee)
        });
        break;
      case LockType.MULTIPLE:
        if (!this.allUnCheckedEmployee) {
          this.modalService.confirm({
            nzTitle: `<b>Bạn có chắc muốn khoá các tài khoản này?</b>`,
            nzContent: 'Ấn đồng ý để tiếp tục',
            nzOkDanger: true,
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOnOk: () => this.multiLockEmployeeAccount().then(r => this.cancelActiveUserConfirm(employee)),
            nzOnCancel: () => this.cancelActiveUserConfirm(employee)
          });
        }

        break;
      default:
        break;
    }
  }


  showUnlockAccountConfirm(type: LockType, employee: any): void {
    employee.isLoadingActiveUser = true;
    switch (type) {
      case LockType.SINGLE:
        this.modalService.confirm({
          nzTitle: `<b>Bạn có chắc muốn mở khoá tài khoản ${employee.username}?</b>`,
          nzContent: 'Ấn đồng ý để tiếp tục',
          nzOkDanger: false,
          nzOkText: 'Đồng ý',
          nzCancelText: 'Không',
          nzOnOk: () => this.unlockEmployeeAccount(employee).then(r => this.cancelActiveUserConfirm(employee)),
          nzOnCancel: () => this.cancelActiveUserConfirm(employee),
        });
        break;
      case LockType.MULTIPLE:
        this.listOfEmployees.forEach(e => {
          if (e.checked) {
            this.modalService.confirm({
              nzTitle: `<b>Bạn có chắc muốn mở khoá các tài khoản này?</b>`,
              nzContent: 'Ấn đồng ý để tiếp tục',
              nzOkDanger: false,
              nzOkText: 'Đồng ý',
              nzCancelText: 'Không',
              nzOnOk: () => this.multiUnlockEmployeeAccount().then(r => this.cancelActiveUserConfirm(employee)),
              nzOnCancel: () => this.cancelActiveUserConfirm(employee)
            });
          }
        });
        break;
      default:
        break;
    }
  }

  private cancelActiveUserConfirm(employee: any) {
    if (employee) {
      employee.isLoadingActiveUser = false;
    }
    this.getEmployeesByPartnerId();
  }

  private multiLockEmployeeAccount() {
    return new Promise((resolve, reject) => {
      this.listOfEmployees.forEach(e => {
        if (e.checked) {
          this.lockEmployeeAccount(e);
        }
      });

      resolve(true);
    });

  }

  private multiUnlockEmployeeAccount() {
    return new Promise((resolve, reject) => {
      this.listOfEmployees.forEach(e => {
        if (e.checked) {
          this.unlockEmployeeAccount(e);
        }
      });
    });

  }

  private lockEmployeeAccount(employee: any) {
    return new Promise((resolve, reject) => {
      let isActive = false;
      this.generalService.setStatusUser(employee.id, isActive).subscribe({
        next: (res) => {
          if (res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, 'Khoá tài khoản không thành công');
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, `Khoá tài khoản ${employee.username} thành công`);
            resolve(true)
          }
        },

        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Khoá tài khoản đã gặp lỗi');
        },

        complete: () => {

        }

      }).add(() => {
      });
    });

  }

  private unlockEmployeeAccount(employee: any) {

    return new Promise((resolve, reject) => {
      let isActive = true;
      this.generalService.setStatusUser(employee.id, isActive).subscribe({
        next: (res) => {
          if (res.ret && res.ret[0].code !== 0) {
            this.notificationService.showNotification(Constant.ERROR, 'Mở khoá tài khoản không thành công');
          } else {
            this.notificationService.showNotification(Constant.SUCCESS, `Mở khoá tài khoản ${employee.username} thành công`);
            resolve(true);
          }
        },

        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Mở khoá tài khoản đã gặp lỗi');
        },

        complete: () => {

        }

      }).add(() => {
      });
    })

  }


  showModalDepositAccount(): void {
    this.isVisibleDepositAccount = true;
  }

  // handleDepositAccountSave(): void {
  //   this.isDepositAccountOkLoading = true;
  //   if (this.formDepositAccount.valid) {
  //     let valueSave = this.formDepositAccount.value;
  //     this.generalService.depositAccount(valueSave).subscribe((res: any) => {
  //       if (res.isValid) {
  //         this.isDepositAccountOkLoading = true;
  //         this.notificationService.showNotification(Constant.SUCCESS, `Nạp tiền cho doanh nghiệp thành công`);
  //       } else {
  //         if (res.errors && res.errors.length > 0) {
  //           res.errors.forEach((el: any) => {
  //             this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
  //           });
  //         } else {
  //           this.notificationService.showNotification(Constant.ERROR, 'Nạp tiền cho doanh nghiệp không thành công');
  //         }
  //       }
  //     }, error => {
  //       this.notificationService.showNotification(Constant.ERROR, 'Nạp tiền cho doanh nghiệp thất bại do lỗi hệ thống');
  //     });
  //   } else {
  //     // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
  //     this.formDepositAccount.markAllAsTouched();
  //     // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
  //     this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
  //   }
  // }

  handleDepositAccountCancel(): void {
    this.isVisibleDepositAccount = false;
    this.updateBalanceFluctuationsBy();
  }

  changeAllowDebt() {
    const allowDebt = this.formBaseInfoCreatePartner.get('allowDebt')?.value === AllowDebtPartner.ALLOW;

    // Update validators for debtMax and warningLimitPrice based on allowDebt
    this.formBaseBusinessContractUpdate.get('debtMax')?.setValidators(
      allowDebt ? Validators.required : Validators.nullValidator
    );
    this.formBaseBusinessContractUpdate.get('warningLimitPrice')?.setValidators(
      allowDebt ? Validators.required : Validators.nullValidator
    );

    // Update the validation state of the entire form
    this.formBaseBusinessContractUpdate.get('debtMax')?.updateValueAndValidity();
    this.formBaseBusinessContractUpdate.get('warningLimitPrice')?.updateValueAndValidity();



    // this.formBaseBusinessContractUpdate.updateValueAndValidity();
    // this.formBaseBusinessContractUpdate.get('debtMax')?.updateValueAndValidity();
    // this.formBaseBusinessContractUpdate.get('warningLimitPrice')?.updateValueAndValidity();
  }


  handleSendApprovalRequest() {
    this.saveBaseInfoPartner().then((result) => {
      this.saveUpdateContractInfoForPartner().then((result) => {
        this.sendApprovalRequest().then((data) => {
          this.setActionValuPage(data);
        })
      })
    })
  }

  handleReturnToDraft() {
    this.returnToDraft().then((data) => {
      this.setActionValuPage(data);
    })
  }

  returnToDraft() {
    return new Promise((resolve, reject) => {
      this.generalService.changeStatusPartnerById(this.itemPartner?.id, PartnerStatus.CreatingProfile).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `Đã chuyển về bản nháp`);
            resolve(res.data);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra');
            }
          }
        },
        error: (error: any) => {
          this.notificationService.showNotification(Constant.ERROR, 'Chuyển về bản nháp thất bại do lỗi hệ thống');
        },

        complete: () => {
        }
      }).add(() => {
      });
    })
  }

  sendApprovalRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.generalService.sendApprovalRequest(this.itemPartner.id).subscribe({
        next: (res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `Đã gửi yêu cầu phê duyệt doanh nghiệp ${this.itemPartner?.companyName ? this.itemPartner?.companyName : ""} thành công`);
            resolve(res.data);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, `Gửi yêu cầu phê duyệt doanh nghiệp ${this.itemPartner?.companyName ? this.itemPartner?.companyName : ""} không thành công`);
            }
            reject(res.errors);
          }
        },
        error: (err: any) => {
          this.notificationService.showNotification(Constant.ERROR, `Không thể gửi yêu cầu phê duyệt doanh nghiệp ${this.itemPartner?.companyName ? this.itemPartner?.companyName : ""} do lỗi hệ thống`);
          reject(err);
        },
        complete: () => {

        }
      });
    });
  }

  submitRequestForApprovalConfirmation(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.generalService.submitRequestForApprovalConfirmation(this.itemPartner.id).subscribe({
        next: (res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `${this.itemPartner?.companyName ? this.itemPartner?.companyName : "doanh nghiệp"} đã được duyệt thành công`);
            resolve(res.data);
            this.setActionValuPage(res.data);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, `Duyệt ${this.itemPartner?.companyName ? this.itemPartner?.companyName : "doanh nghiệp"} không thành cônng`);
            }
            reject(res.errors);
          }
        },
        error: (err: any) => {
          this.notificationService.showNotification(Constant.ERROR, `Duyệt ${this.itemPartner?.companyName ? this.itemPartner?.companyName : "doanh nghiệp"} thất bại do lỗi hệ thống`);
          reject(err);
        },
        complete: () => {

        }
      });
    });
  }

  setActionValuPage(value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.itemPartner = value;
      this.setActionPageByStatus(this.itemPartner?.status);
      resolve(value);
    })
  }
  showPopupChangePassword() {
    this.isVisibleChangePassword = true;
  }

  showResetPassword(user: any): void {
    user.isLoadingResetPassword = true;
    this.modalService.confirm({
      nzTitle: `<b>Bạn có chắc muốn thiết lập lại mật khẩu mặc định cho tài khoản ${user.username}?</b>`,
      nzContent: 'Ấn đồng ý để tiếp tục',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.resetPassword(user),
      nzOnCancel: () => this.cancelResetPassword(user)
    });
  }

  private cancelResetPassword(user: any) {
    user.isLoadingResetPassword = false;
  }


  resetPassword(user: any) {
    this.generalService.resetPasswordUser(user.id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, `Thiết lập mật khẩu mặc định tài khoản ${user.username} thành công`);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, `Thiết lập mật khẩu mặc định tài khoản ${user.username} không thành công`);
          }
        }
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, `Thiết lập mật khẩu mặc định tài khoản ${user.username} không thành công do lỗi hệ thống`);
      },
      complete: () => {
        // this.getListData().then(() => {
        // });
        this.getEmployeesByPartnerId();
      }
    }).add(() => { user.isLoadingActiveUser = false; });
  }

  handleCancelChangePassword() {
    this.isVisibleChangePassword = false;
  }


  handleLockCompany() {
    this.generalService.changeStatusPartnerById(this.itemPartner?.id, PartnerStatus.Locked).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, `Đã khoá doanh nghiệp ${this.itemPartner.companyName}`);
          this.setActionValuPage(res.data);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra');
          }
        }
      },
      error: (error: any) => {
        this.notificationService.showNotification(Constant.ERROR, 'Không thể khoá doanh nghiệp do lỗi hệ thống');
      },

      complete: () => {
      }
    }).add(() => {
    });
  }

  handleUnLockCompany() {
    this.generalService.changeStatusPartnerById(this.itemPartner?.id, PartnerStatus.CreatingProfile).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, `Doanh nghiệp ${this.itemPartner.companyName} đã được mở khoá`);
          this.setActionValuPage(res.data);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra');
          }
        }
      },
      error: (error: any) => {
        this.notificationService.showNotification(Constant.ERROR, 'Không thể mở doanh nghiệp do lỗi hệ thống');
      },

      complete: () => {
      }
    }).add(() => {
    });
  }
}
