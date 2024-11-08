import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NotificationPageStateService {
  private statusNotify = {};
  private dataNotificationPageSubject = new BehaviorSubject<any>(this.statusNotify);
  sendStatus(statusNotify: any): void {
    this.statusNotify = statusNotify;
    this.dataNotificationPageSubject.next(statusNotify);
  }
  receiveStatus(): Observable<any> {
    return this.dataNotificationPageSubject.asObservable();
  }
}
