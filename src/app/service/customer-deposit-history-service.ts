import { Injectable } from '@angular/core';
import { BaseService } from '../shared/base-service/base-service.service';
import { Observable } from 'rxjs';
import { SearchUser } from '../model/searchUser.class';
import { UrlConstant } from '../shared/constants/url.class';

@Injectable({ providedIn: 'root' })
export class CustomerDepositHistoryService extends BaseService {

  getCustomerDepositHistoryById(customerDepositHistoryId: number): any {
    return this.get(`/api${UrlConstant.LIST_CUSTOMER_DEPOSIT_HISTORY}/GetCustomerDepositHistoryById/${customerDepositHistoryId}`);
  }

  confirmDepositAccount(payload: any): Observable<any> {
    return this.post(`/api${UrlConstant.LIST_CUSTOMER_DEPOSIT_HISTORY}/ConfirmDepositAccount`, payload);
  }
}
