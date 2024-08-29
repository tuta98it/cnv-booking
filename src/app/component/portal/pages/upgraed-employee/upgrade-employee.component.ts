import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { MENU_UPGRADE_EMPLOYEE_OPTION, MenuUpgradeEmployee } from 'src/app/enums/menu-upgrade-employee.enum';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import { NZTableSettingCustoms } from 'src/app/Interfaces/nz-table-seting.interface';
import { ActionTypePageVHL } from 'src/app/enums/action-type-page-vhl.enum';
import { AllowDebtPartner } from 'src/app/shared/constants/allow-debt-partner.class';
import { UploadFileSetting } from 'src/app/Interfaces/upload-file-setting.interface';
import { AppConfigService } from 'src/app-config.service';
import { TypeOfDocument } from 'src/app/enums/type-of-document.enum';
import { Constant } from 'src/app/shared/constants/constant.class';
import { NotificationService } from 'src/app/service/notification.service';
import { BusinessServiceType } from 'src/app/enums/business-service-type';
import { PaymentPeriod, PAYMENT_PERIOD_VHL_OPTIONS, PAYMENT_PERIOD_FULL_OPTIONS } from 'src/app/enums/payment-period.enum';
import { Weekdays, WEEKDAYS_OPTIONS } from 'src/app/enums/weekdays.enum';
import { DAYS_OF_MONTH_OPTIONS, DaysOfMonth } from 'src/app/enums/days-of-month.enum';
import { MONTHS_OPTIONS, MonthsOfTheYear } from 'src/app/enums/months-of-the-year.enum';
import { USES_TYPE_OPTIONS, TEXT_USER_TYPE, UserType } from 'src/app/enums/user-type.enum';
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents';
import { GeneralService } from 'src/app/service/general-service';
import { USER_STATUS_OPTIONS, UserStatus } from 'src/app/enums/user-status.enum';
import { TEXT_PARTNER_STATUS } from 'src/app/enums/partner-status.enum';
import { Gender, GENDER_OPTIONS, TEXT_GENDER } from 'src/app/enums/gender.enum';
import { Location } from '@angular/common';
type TableScroll = 'unset' | 'scroll' | 'fixed';

@Component({
  selector: 'app-upgrade-employee',
  templateUrl: './upgrade-employee.component.html',
  styleUrls: ['./upgrade-employee.component.scss']
})
export class UpgradeEmployeeComponent implements OnInit {

  ActionTypePageVHL = ActionTypePageVHL;
  MenuUpgradeEmployee = MenuUpgradeEmployee;
  MENU_UPGRADE_EMPLOYEE_OPTION = MENU_UPGRADE_EMPLOYEE_OPTION;

  EmployeeStatus = UserStatus;
  EMPLOYEE_STATUS_OPTIONS = USER_STATUS_OPTIONS;
  TEXT_PARTNER_STATUS = TEXT_PARTNER_STATUS;

  UserType = UserType;
  TEXT_USER_TYPE = TEXT_USER_TYPE;
  USES_TYPE_OPTIONS = USES_TYPE_OPTIONS;

  Gender = Gender;
  GENDER_OPTIONS = GENDER_OPTIONS;
  TEXT_GENDER = TEXT_GENDER;

  AllowDebtPartner = AllowDebtPartner;
  selectedMenu = MenuUpgradeEmployee.CompanyInfo;
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
  actionEmployeeVHL: any;
  indeterminateEmployee = false;
  fixedColumn = false;
  listOfEmployees: readonly any[] = [];
  formBaseInfoEmployee: FormGroup;

  checkOptionsBusinessServiceVHL = [
    { label: 'Dịch vụ vé máy bay', value: BusinessServiceType.AirlineTicketBookingService, disabled: false, checked: true },
    { label: 'Dich vụ đặt khách sạn', value: BusinessServiceType.HotelBookingService, disabled: false, checked: false },
  ];
  itemEmployee: any = null;
  partnerForEmployee: any = null;
  employees: any;
  isActiveEditBaseInfo: boolean = false;
  searchEmployee: string = '';

  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private router: Router,
    private location: Location
  ) {

    this.formBaseInfoEmployee = this.formBuilder.group({
      id: [null],
      status: new FormControl({ value: UserStatus.ACTIVE, disabled: this.actionEmployeeVHL == ActionTypePageVHL.Create }, Validators.required),
      userType: new FormControl({ value: UserType.NormalAccount, disabled: false }),
      userCode: new FormControl({ value: null, disabled: true }),
      fullname: new FormControl({ value: null, disabled: false }, Validators.required),
      personalIdentifier: new FormControl({ value: null, disabled: false }, Validators.required),
      email: new FormControl({ value: null, disabled: false }, Validators.required),
      gender: new FormControl({ value: Gender.MALE, disabled: false }, Validators.required),
      birthday: new FormControl({ value: null, disabled: false }),
      phoneNo: new FormControl({ value: null, disabled: false }, Validators.required),
      nationality: new FormControl({ value: null, disabled: false }),
      directManagementUserId: new FormControl({ value: null, disabled: false }),
      staffCode: new FormControl({ value: null, disabled: false }),
      membershipCode: new FormControl({ value: null, disabled: false }),
      position: new FormControl({ value: null, disabled: false }),
      department: new FormControl({ value: null, disabled: false }),
    });


  }

  ngAfterViewInit() {
    this.actionEmployeeVHL = this.activatedRoute.snapshot.data['type'];
    this.setIsActiveEditBaseInfo(true);
    this.listOfEmployees = [];

    this.activatedRoute.queryParams.subscribe(async params => {
      let idPartner = +params['partnerId']; // Lấy id từ query parameter

      this.partnerForEmployee = await this.getPartnerById(idPartner).catch((reject) => {
        this.notificationService.showNotification(Constant.ERROR, `Lỗi truy vấn dữ liệu doanh nghiệp`);
        this.location.back();
      });
    });

    if (this.actionEmployeeVHL == ActionTypePageVHL.Create) {
      this.listOfEmployees = [];
      this.resetFormBaseInfoCreateEmployee(null);
    } else if (this.actionEmployeeVHL == ActionTypePageVHL.Update) {
      this.setIsActiveEditBaseInfo(true);
      this.activatedRoute.queryParams.subscribe(async params => {
        let idEmployee = +params['employeeId']; // Lấy id từ query parameter
        this.itemEmployee = await this.getEmployeeById(idEmployee).catch((reject) => {
          this.notificationService.showNotification(Constant.ERROR, `Lỗi truy vấn dữ liệu nhân viên`);
          this.location.back();
        });
        this.resetFormBaseInfoCreateEmployee(this.itemEmployee);
      });
    }
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  private async resetFormBaseInfoCreateEmployee(itemEmployee: any) {
    this.formBaseInfoEmployee.reset({
      id: itemEmployee?.id || null,
      status: { value: itemEmployee?.status || UserStatus.ACTIVE, disabled: this.actionEmployeeVHL == ActionTypePageVHL.Create },
      userType: itemEmployee?.userType || UserType.NormalAccount,
      userCode: { value: itemEmployee?.userCode || null, disabled: true },
      fullname: itemEmployee?.fullname || null,
      personalIdentifier: itemEmployee?.personalIdentifier || null,
      email: itemEmployee?.email || null,
      gender: itemEmployee?.gender || Gender.MALE,
      birthday: itemEmployee?.birthday || null,
      phoneNo: itemEmployee?.phoneNo || null,
      nationality: itemEmployee?.nationality || null,
      directManagementUserId: itemEmployee?.directManagementUserId || null,
      staffCode: itemEmployee?.staffCode || null,
      membershipCode: itemEmployee?.membershipCode || null,
      position: itemEmployee?.position || null,
      department: itemEmployee?.department || null,
    });
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

  private getEmployeeById(employeeId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.generalService.getUserById(employeeId).subscribe((res: any) => {
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

  saveBaseInfoEmployee() {
    if (this.formBaseInfoEmployee.valid) {
      let payload = this.formBaseInfoEmployee.value;
      payload = { partnerId: this.partnerForEmployee.id, ...payload };

      if (this.itemEmployee?.id) {
        this.generalService.updateEmployeeBaseInfoForPartnerById(this.itemEmployee.id, payload).subscribe((res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật thông tin nhân viên thành công`);
            this.itemEmployee = res.data;
            this.resetFormBaseInfoCreateEmployee(this.itemEmployee);
            this.setIsActiveEditBaseInfo(this.itemEmployee?.id == null);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin nhân viên không thành công');
            }
          }
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, 'Cập nhật thông tin nhân viên thất bại do lỗi hệ thống');
        });
      } else {
        this.generalService.createEmployeeBaseInfoForPartner(payload).subscribe((res: any) => {
          if (res.isValid) {
            this.notificationService.showNotification(Constant.SUCCESS, `Tạo mới thông tin nhân viên thành công`);
            this.itemEmployee = res.data;
            this.resetFormBaseInfoCreateEmployee(this.itemEmployee);
            this.setIsActiveEditBaseInfo(this.itemEmployee?.id == null);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
              });
            } else {
              this.notificationService.showNotification(Constant.ERROR, 'Tạo mới thông tin nhân viên không thành công');
            }
          }
        }, error => {
          this.notificationService.showNotification(Constant.ERROR, 'Tạo mới thông tin nhân viên thất bại do lỗi hệ thống');
        });
      }

    } else {
      // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
      this.formBaseInfoEmployee.markAllAsTouched();
      // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
      this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
    }
  }

  editBaseInfoEmployee() {
    this.setIsActiveEditBaseInfo(true);
  }

  private setIsActiveEditBaseInfo(value: boolean) {
    this.isActiveEditBaseInfo = value;
    if (this.isActiveEditBaseInfo) {
      this.formBaseInfoEmployee.enable();
      if (this.actionEmployeeVHL == ActionTypePageVHL.Create) {
        this.formBaseInfoEmployee.controls['status'].disable();
      }
    } else {
      this.formBaseInfoEmployee.disable();
    }
  }

  cancelBaseInfoPartner() {
    this.setIsActiveEditBaseInfo(true);
    this.resetFormBaseInfoCreateEmployee(this.itemEmployee);
  }

  cancelPageActionEmployee() {
    this.cancelBaseInfoPartner();
    this.location.back();
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
