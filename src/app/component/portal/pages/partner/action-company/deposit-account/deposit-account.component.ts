import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppConfigService } from 'src/app-config.service';
import { GeneralService } from 'src/app/service/general-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant, DepositConstant } from 'src/app/shared/constants/constant.class';
@Component({
  selector: 'app-deposit-account',
  templateUrl: './deposit-account.component.html',
  styleUrls: ['./deposit-account.component.scss']
})
export class DepositAccountComponent implements OnInit {



  @Input() partnerId: number = null;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Input() employees: any[] = [];
  isDepositAccountOkLoading = false;

  private _isVisibleDepositAccount: boolean = false;

  @Input()
  set isVisibleDepositAccount(value: boolean) {
    this._isVisibleDepositAccount = value;
    if (value) {
      this.getUserInfo();
      this.formDepositAccount.reset({
        id: null,
        implementPersonId: this.userInfor.id,
        depositContent: DepositConstant.DEPOSIT_CONTENT_DEFAULT,
      });
    }
  }

  get isVisibleDepositAccount(): boolean {
    return this._isVisibleDepositAccount;
  }

  valueInputNumberAmount = '';
  tooltipTitleAmount = 'Nhập số tiền';
  formDepositAccount: FormGroup;
  userInfor: any;
  constructor(private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NzModalService,) {
    this.formDepositAccount = this.formBuilder.group({
      id: [null],
      amountDeposited: new FormControl({ value: null, disabled: false }, Validators.required),
      implementPersonId: new FormControl({ value: null, disabled: false }, Validators.required),
      depositContent: new FormControl({ value: null, disabled: false }, Validators.required),
    });
  }



  ngOnInit(): void {

  }
  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }


  onChangeInputAmount(value: string, controlName?: string): void {
    this.updateValueInputAmount(value);
  }


  onClickInputAmount(event: any, controlName?: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.valueInputNumberAmount = inputElement.value;

    this.updateValueInputAmount(this.valueInputNumberAmount);
  }

  // '.' at the end or only '-' in the input box.
  onBlurInputAmount(controlName?: string): void {
    if (this.valueInputNumberAmount.charAt(this.valueInputNumberAmount.length - 1) === '.' || this.valueInputNumberAmount === '-') {
      this.updateValueInputAmount(this.valueInputNumberAmount.slice(0, -1), controlName);
      this.tooltipTitleAmount = "0 VNĐ"
    }
  }


  updateValueInputAmount(value: string, controlName?: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.valueInputNumberAmount = value;
    }
    // Chỉ cập nhật nếu giá trị khác
    if (controlName) {
      const control = this.formDepositAccount.get(controlName);
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


  handleDepositAccountSave(): void {
    this.isDepositAccountOkLoading = true;
    if (this.formDepositAccount.valid) {
      let valueSave = this.formDepositAccount.value;
      valueSave = { partnerId: this.partnerId, ...valueSave }
      this.generalService.depositAccount(valueSave).subscribe((res: any) => {
        if (res.isValid) {
          this.isDepositAccountOkLoading = false;
          this.notificationService.showNotification(Constant.SUCCESS, `Nạp tiền cho doanh nghiệp thành công`);
          this.handleDepositAccountCancel();
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Nạp tiền cho doanh nghiệp không thành công');
          }
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Nạp tiền cho doanh nghiệp thất bại do lỗi hệ thống');
      });
    } else {
      // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
      this.formDepositAccount.markAllAsTouched();
      // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
      this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
    }
  }

  handleDepositAccountCancel(): void {
    this.formDepositAccount.reset();
    this.cancel.emit();
  }
}
