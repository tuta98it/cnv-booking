import { Injectable } from '@angular/core';
import { BaseService } from '../shared/base-service/base-service.service';
import { Observable } from 'rxjs';
import { SearchUser } from '../model/searchUser.class';
import { UrlConstant } from '../shared/constants/url.class';

@Injectable({ providedIn: 'root' })
export class AccountDepositService extends BaseService {

  confirmDepositAccount(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.LIST_ACCOUNT_HISTORY}/ConfirmDepositAccount`, payload);
  }
}
