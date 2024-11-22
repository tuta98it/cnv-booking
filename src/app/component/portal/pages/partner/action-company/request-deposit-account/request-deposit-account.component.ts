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
import { constants } from 'buffer';
import { AccountDepositService } from 'src/app/service/account-deposit-history-service';
@Component({
  selector: 'request-deposit-account',
  templateUrl: './request-deposit-account.component.html',
  styleUrls: ['./request-deposit-account.component.scss']
})
export class RequestDepositAccountComponent implements OnInit, AfterViewInit {

  Constant = Constant;
  @Input() isVisibleRequestDepositAccount: boolean = false;
  @Input() customerDepositHistoryId: number = null;
  @Input() partnerId: number = null;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  isDepositAccountOkLoading = false;


  valueInputNumberAmount = '';
  tooltipTitleAmount = 'Nhập số tiền';
  formRequestDepositAccount: FormGroup;
  userInfor: any;
  idCustomerDepositHistory: number;
  customerDeposit: any;
  employees: any;

  isVisibleContentConfirmDeposit = false;
  isConfirmed: boolean;

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
    private accountDepositService: AccountDepositService,

  ) {
    this.formRequestDepositAccount = this.formBuilder.group({
      id: [null],
      amountDeposited: new FormControl({ value: null, disabled: false }, Validators.required),
      implementPersonId: new FormControl({ value: null, disabled: false }, Validators.required),
      depositContent: new FormControl({ value: null, disabled: false }, Validators.required),
      note: new FormControl({ value: null, disabled: false }),
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
                this.isConfirmed = this.customerDeposit.isConfirmed
                this.formRequestDepositAccount.reset({
                  id: null,
                  amountDeposited: this.customerDeposit.amountDeposited,
                  implementPersonId: this.customerDeposit.implementPersonId,
                  depositContent: this.customerDeposit.depositContent,
                  note: null,
                });

                this.generalService.getUsersByPartnerId(this.customerDeposit.partnerId).subscribe({
                  next: (res: any) => {
                    if (res.isValid) {
                      this.employees = res.data;
                    } else {
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

  handleConfirmDepositAccountSave(): void {
    const newCustomerDeposit = this.formRequestDepositAccount.value;
    const oldCustomerDeposit = this.customerDeposit;
    // So sánh giá trị mới và cũ
    const isUnchanged =
      newCustomerDeposit.amountDeposited === oldCustomerDeposit.amountDeposited &&
      newCustomerDeposit.implementPersonId === oldCustomerDeposit.implementPersonId && // Sửa tên đúng
      newCustomerDeposit.depositContent === oldCustomerDeposit.depositContent;

    if (isUnchanged) {

      this.isDepositAccountOkLoading = true;
      if (this.formRequestDepositAccount.valid) {
        let valueSave = this.formRequestDepositAccount.value;
        valueSave = { partnerId: this.partnerId, customerDepositHistoryId: this.customerDepositHistoryId, ...valueSave }
        this.confirmDepositAccount(valueSave).then((result) => {
          this.handlRequestDepositAccountCancel();
        }).catch((error) => {
          console.log(error);
        });
      } else {
        // Đánh dấu tất cả các trường là đã được chạm (touched) để hiển thị lỗi
        this.formRequestDepositAccount.markAllAsTouched();
        // this.notificationService.showNotification(Constant.SUCCESS, "Tồn tại trường thông tin chưa được nhập");
        this.msg.error(`Tồn tại trường thông tin chưa được nhập`);
      }
    } else {
      this.cancelRequestDepositAccount();
      this.showModalContentConfirmDeposit();
    }
  }
  handleOkContentConfirmDeposit(): void {
    let noteDepositAccount = this.formRequestDepositAccount.value.note;
    if (noteDepositAccount) {
      let valueSave = this.formRequestDepositAccount.value;
      valueSave = { partnerId: this.partnerId, customerDepositHistoryId: this.customerDepositHistoryId, ...valueSave };
      this.confirmDepositAccount(valueSave).then(() => {
        this.handleCancelContentConfirmDeposit();
        this.handlRequestDepositAccountCancel();
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.msg.error(`Nội dung ghi chú không được để trống!`);
    }
  }

  private confirmDepositAccount(valueSave: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.accountDepositService.confirmDepositAccount(valueSave).subscribe((res: any) => {
        if (res.isValid) {
          this.isDepositAccountOkLoading = false;
          this.notificationService.showNotification(Constant.SUCCESS, `Nạp tiền cho doanh nghiệp thành công`);
          resolve(res.data);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Nạp tiền cho doanh nghiệp không thành công');
          }
          reject(res.errors);
        }
      }, error => {
        this.notificationService.showNotification(Constant.ERROR, 'Nạp tiền cho doanh nghiệp thất bại do lỗi hệ thống');
        reject(error);
      });
    });
  }
  private showModalContentConfirmDeposit(): void {
    this.isVisibleContentConfirmDeposit = true;
  }

  handleCancelContentConfirmDeposit(): void {
    this.isVisibleContentConfirmDeposit = false;
  }

  private cancelRequestDepositAccount(): void {
    this.isVisibleRequestDepositAccount = false;
  }
  handlRequestDepositAccountCancel(): void {
    this.formRequestDepositAccount.reset();
    this.cancel.emit();
  }
}
