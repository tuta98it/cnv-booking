import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../../shared/constants/constant.class';
import { Cookie } from 'ng2-cookies';
import { Subscription } from 'rxjs';
import { User } from '../../../model/user.class';
import { AuthModel } from '../../../model/auth.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromAuth from '../redux/auth.reducer';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user-service';
import { GeneralService } from '../../../service/general-service';
import { NotificationService } from "../../../service/notification.service";

@Component({
  selector: 'app-sms-login',
  templateUrl: './sms-login.component.html',
  styleUrls: ['./sms-login.component.scss']
})
export class SmsLoginComponent implements OnInit {
  validateForm: FormGroup;
  checked = false;
  isVisibleForgotPassowrd: boolean = false;
  isSendEmailLoading: boolean = false;
  emaillForgotPassowrd: string;
  returnUrl: string;
  messageError: string;
  sub: Subscription;
  user: User;
  auth: AuthModel;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<fromAuth.AppState>,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private userService: UserService,
    private generalService: GeneralService

  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || Constant.WELCOME;

    const currentUser = localStorage.getItem(Constant.TOKEN)
    if (currentUser) {
      this.router.navigate([Constant.WELCOME]);
    }
  }
  submitForm(): void {
    this.sub = this.authService.loginAdmin(this.validateForm.value).subscribe(res => {
      if (res !== null && !res.message) {
        localStorage.setItem(Constant.TOKEN, res.token);
        localStorage.setItem(Constant.USER_INFO, JSON.stringify(res));
        localStorage.setItem(Constant.TINHTHANH, res.tinhThanhId);
        if (res.quanHuyenId) {
          localStorage.setItem(Constant.QUANHUYEN, res.quanHuyenId);
        }
        this.router.navigateByUrl(`${Constant.DEFAULT_PAGE}`);
      } else {
        this.notificationService.showNotification(Constant.ERROR, res.message);
      }
    }, error => {
      this.messageError = error.error.message;
      this.notificationService.showNotification(Constant.ERROR, this.messageError);
    });
  }

  cancelModalForgotPassowrd() {
    this.isVisibleForgotPassowrd = false;
    this.emaillForgotPassowrd = '';
  }

  openModalForgotPassowrd() {
    this.isVisibleForgotPassowrd = true
  }
  sendLinkForgotPassowrd() {
    this.generalService.forgotPassword(this.emaillForgotPassowrd).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationService.showNotification(Constant.SUCCESS, res.jsonData);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            });
          } else {
            this.notificationService.showNotification(Constant.ERROR, 'Không thể gửi email');
          }
        }
      },
      error: (error: any) => {
        this.notificationService.showNotification(Constant.ERROR, 'Gửi email đã gặp lỗi');
      },

      complete: () => {
      }
    })
    .add(() => {
    });
  }
}
