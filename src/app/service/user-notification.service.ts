import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../shared/base-service/base-service.service";
@Injectable({
    providedIn: 'root'
})
export class UserNotificationService extends BaseService{
    url= 'usernotification';
    devicereGistration(data: any): Observable<any> {
      return this.post(`${this.url}/deviceregistration`,data);
    }
}
