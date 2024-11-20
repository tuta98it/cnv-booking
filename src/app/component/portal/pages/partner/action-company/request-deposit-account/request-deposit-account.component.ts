import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterAction } from '@ngrx/router-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppConfigService } from 'src/app-config.service';
import { GeneralService } from 'src/app/service/general-service';
import { NotificationAPIService } from 'src/app/service/notification-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant, DepositConstant } from 'src/app/shared/constants/constant.class';
import { CustomerDepositHistoryService } from './../../../../../../service/customer-deposit-history-service';
@Component({
  selector: 'request-deposit-account',
  templateUrl: './request-deposit-account.component.html',
  styleUrls: ['./request-deposit-account.component.scss']
})
export class RequestDepositAccountComponent implements OnInit, AfterViewInit {


  @Input() isVisibleRequestDepositAccount: boolean = false;
  @Input() notifyId: number = null;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  isDepositAccountOkLoading = false;


  valueInputNumberAmount = '';
  tooltipTitleAmount = 'Nhập số tiền';
  formDepositAccount: FormGroup;
  userInfor: any;
  idCustomerDepositHistory: number;
  customerDeposit: any;
  employees: any;
  constructor(private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private notificationAPIService: NotificationAPIService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private customerDepositHistoryService: CustomerDepositHistoryService,

  ) {
    this.formDepositAccount = this.formBuilder.group({
      id: [null],
      amountDeposited: new FormControl({ value: null, disabled: false }, Validators.required),
      implementPersonId: new FormControl({ value: null, disabled: false }, Validators.required),
      depositContent: new FormControl({ value: null, disabled: false }, Validators.required),
    });
  }
  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(async params => {
      this.idCustomerDepositHistory = +params[Constant.ID_CUSTOMER_DEPOSIT_HISTORY];
      if (this.idCustomerDepositHistory) {
        this.customerDepositHistoryService.getCustomerDepositHistoryById(this.idCustomerDepositHistory).subscribe(
          {
            next: (res: any) => {
              if (res.isValid) {
                this.customerDeposit = res.data;
                this.formDepositAccount.reset({
                  id: null,
                  amountDeposited: this.customerDeposit.amountDeposited,
                  implementPersonId: this.customerDeposit.implenmentPersonId,
                  depositContent: this.customerDeposit.depositContent,
                });

                this.generalService.getUsersByPartnerId(this.customerDeposit.partnerId).subscribe({
                  next: (res: any) => {
                    if(res.isValid) {
                      this.employees = res.data;
                    }else{
                      this.employees = [];
                    }
                  }
                });
              } else {
              }
            },

            error: (error) => {
              console.log(error);
            },

            compile: () => {

            }
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }


  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }

  handleDepositAccountSave(): void {
    this.isDepositAccountOkLoading = true;
    if (this.formDepositAccount.valid) {
      let valueSave = this.formDepositAccount.value;
      valueSave = { partnerId: this.notifyId, ...valueSave }
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
