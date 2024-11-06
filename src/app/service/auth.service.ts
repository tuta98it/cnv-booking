import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthModel } from '../model/auth.model';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../shared/constants/constant.class';
import { AppConfigService } from '../../app-config.service';
import { UrlConstant } from '../shared/constants/url.class';
@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient, private configService: AppConfigService) {
  }
  login(payload): Observable<any> {
    return this.httpClient.post(this.configService.getConfig().api.baseUrl + '/login', payload);
  }

  loginAdmin(payload): Observable<any> {
    return this.httpClient.post(this.configService.getConfig().api.baseUrl + '/loginAdmin', payload);
  }


  logout() {
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    }
    let token = localStorage.getItem(localStorage.getItem(Constant.TOKEN));
    token = 'Bearer ' + localStorage.getItem(Constant.TOKEN);


    const KEY_FIREBASE_TOKEN = localStorage.getItem(Constant.KEY_FIREBASE_TOKEN);
    return this.httpClient.post(this.configService.getConfig().api.baseUrl + '/Login/LogoutAdminPortal', {
      "tokenFCM": KEY_FIREBASE_TOKEN
    }, { headers });
  }
  checkToken(): any {
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem(Constant.TOKEN),
    }
    let token = localStorage.getItem(localStorage.getItem(Constant.TOKEN));
    token = 'Bearer ' + localStorage.getItem(Constant.TOKEN);
    return this.httpClient.post(this.configService.getConfig().api.baseUrl + '/Login/Validate', token, { headers });
  }
}
