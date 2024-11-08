import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationBellStateService {
  private statusNotify = {};
  private dataNotificationBellSubject = new BehaviorSubject<any>(this.statusNotify);
  sendStatus(statusNotify: any): void {
    this.statusNotify = statusNotify;
    this.dataNotificationBellSubject.next(statusNotify);
  }
  receiveStatus(): Observable<any> {
    return this.dataNotificationBellSubject.asObservable();
  }
}
