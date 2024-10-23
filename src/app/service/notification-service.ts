import { Injectable } from '@angular/core';
import { BaseService } from '../shared/base-service/base-service.service';
import { Observable } from 'rxjs';
import { SearchUser } from '../model/searchUser.class';
import { UrlConstant } from '../shared/constants/url.class';

@Injectable({ providedIn: 'root' })
export class NotificationAPIService extends BaseService {

  getTopNotifications(): Observable<any> {
    return this.get(`/api${UrlConstant.LIST_NOTIFY}/GetTopUserNotification`);
  }

  getAllNotificatons(): Observable<any> {
    return this.post(`/api${UrlConstant.LIST_NOTIFY}/GetAllUserNotification`, {
      "page": 1,
      "pageSize": 1000,
    });
  }

  readNotificationByIds(ids: number[]): Observable<any> {
    return this.post(`/api${UrlConstant.LIST_NOTIFY}/ReadNotifications`,{
      "ids": ids,
    });
  }

  getAllNotifications(): Observable<any> {
    return this.post(`/api${UrlConstant.LIST_NOTIFY}/GetAllUserNotification`,{
      "page": 1,
      "pageSize": 1000,
      "readed": null,
    });
  }
}
