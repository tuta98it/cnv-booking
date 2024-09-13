import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppConfigService } from 'src/app-config.service';
import { GeneralService } from 'src/app/service/general-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/shared/constants/constant.class';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


  @Input() isVisible: boolean = false;
  @Input() idEmployee: number = null;
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  passwordVisible: boolean = false;
  repeatpasswordVisible: boolean = false;
  formChangePassword: FormGroup;
  constructor(private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private configService: AppConfigService,
    private generalService: GeneralService,
    private notificationService: NotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private modalService: NzModalService,) {
    this.formChangePassword = this.formBuilder.group({
      password: [null, [Validators.required]],
      repeatPassword: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  handleSave() {
    const payloadChangePassword = this.formChangePassword.value;
    if (this.idEmployee) {
      this.generalService.changeUserPassword(this.idEmployee, payloadChangePassword).subscribe((res: any) => {
        if (res.ret[0].code != null && res.ret[0].code != 0 ) {
          this.notificationService.showNotification(
            Constant.ERROR,
            res.ret[0].message
          );
        } else {

          this.notificationService.showNotification(
            Constant.SUCCESS,
            "Đổi mật khẩu thành công"
          );
          this.formChangePassword.reset();
          this.handleCancel();
        }
      }).add(() => { });
    } else {
      this.notificationService.showNotification(
        Constant.ERROR,
        "Không xác định được nhân viên"
      );
    }

  }

  handleCancel(): void {
    this.cancel.emit();
  }

}
