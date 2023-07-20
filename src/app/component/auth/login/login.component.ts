import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import * as fromAuth from '../redux/auth.reducer';
import * as actionAuth from '../redux/auth.action';
import {AuthModel} from '../../../model/auth.model';
import {Observable, Subscription} from 'rxjs';
import {Constant} from '../../../shared/constants/constant.class';
import {AuthService} from '../../../service/auth.service';
import {User} from '../../../model/user.class';
import {HttpParams} from '@angular/common/http';
import {UserService} from '../../../service/user-service';
import {error} from 'selenium-webdriver';
import {Cookie} from 'ng2-cookies';
import {GeneralService} from '../../../service/general-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit , OnDestroy {
  validateForm: FormGroup;
  returnUrl: string;
  messageError: string;
  sub: Subscription;
  user: User;
  auth: AuthModel;
  tabs: any[];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<fromAuth.AppState>,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private generalService: GeneralService
    ) {
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || Constant.WELCOME;
    const currentUser = Cookie.get(Constant.TOKEN);
    if (currentUser) {
      this.router.navigate([Constant.WELCOME]);
    }
  }
  submitForm(): void {
    this.sub = this.authService.login(this.validateForm.value).subscribe(res => {
      if (res !== null) {
        const expiresIn = 499;
        localStorage.setItem(Constant.TOKEN, res.token);
        localStorage.setItem(Constant.USER_INFO, JSON.stringify(res));
        const expireDate = new Date().getTime() + expiresIn;
        // console.log(expireDate);
        Cookie.set(Constant.TOKEN, res.token, expireDate);
        localStorage.setItem(Constant.TINHTHANH, res.tinhThanhId);
        if (res.quanHuyenId) {
          localStorage.setItem(Constant.QUANHUYEN, res.quanHuyenId);
        }
        this.router.navigateByUrl(this.returnUrl);


      }
      // tslint:disable-next-line:no-shadowed-variable
    }, error => {
        this.messageError = Constant.LOGIN_FAIL;
    });
  }
}
