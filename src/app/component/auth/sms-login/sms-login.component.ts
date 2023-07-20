import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constant} from '../../../shared/constants/constant.class';
import {Cookie} from 'ng2-cookies';
import {Subscription} from 'rxjs';
import {User} from '../../../model/user.class';
import {AuthModel} from '../../../model/auth.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromAuth from '../redux/auth.reducer';
import {AuthService} from '../../../service/auth.service';
import {UserService} from '../../../service/user-service';
import {GeneralService} from '../../../service/general-service';
import {NotificationService} from "../../../service/notification.service";

@Component({
  selector: 'app-sms-login',
  templateUrl: './sms-login.component.html',
  styleUrls: ['./sms-login.component.scss']
})
export class SmsLoginComponent implements OnInit {
  validateForm: FormGroup;
  checked = false;
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
    this.sub = this.authService.login(this.validateForm.value).subscribe(res => {
      if (res !== null && !res.message) {
        localStorage.setItem(Constant.TOKEN, res.token);
        localStorage.setItem(Constant.USER_INFO, JSON.stringify(res));
        localStorage.setItem(Constant.TINHTHANH, res.tinhThanhId);
        if (res.quanHuyenId) {
          localStorage.setItem(Constant.QUANHUYEN, res.quanHuyenId);
        }
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.notificationService.showNotification(Constant.ERROR, res.message);
      }
    }, error => {
      this.messageError = Constant.LOGIN_FAIL;
      this.notificationService.showNotification(Constant.ERROR, this.messageError );
    });
  }

}
