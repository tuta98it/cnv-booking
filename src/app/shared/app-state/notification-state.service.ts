import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ISlideNotification } from 'src/app/models/slide-notification';
import { Constants } from '../constants/constants';
@Injectable({
  providedIn: 'root'
})
export class NotificationStateService {
  protected notificationsSubject: BehaviorSubject<ISlideNotification[]>;
  protected notifications:ISlideNotification[] = [];

  constructor() {
    this.notificationsSubject = new BehaviorSubject<ISlideNotification[]>(this.notifications);
  }

  public subscribeNotifications(callback: (data: ISlideNotification[]) => void): Subscription {
    return this.notificationsSubject.subscribe(callback);
  }

  public dispatchNotifications(notifications: ISlideNotification[]): void {
    // const dispatchedModel: ISlideNotification[] = JSON.parse(JSON.stringify(notifications));
    // this.notificationsSubject.next(dispatchedModel);
    this.notifications = notifications;
    this.notificationsSubject.next(notifications);
  }

  public updateProgress(id: string, progress: number) {
    this.notifications.forEach(n => {
      if (n.id == id) {
        n.uploadProgress = progress;
      }
    });
    this.dispatchNotifications(this.notifications);
  }

  public updateState(id: string, state: number) {
    this.notifications.forEach(n => {
      if (n.id == id) {
        n.state = state;
        if (state == Constants.UPLOAD_STATUS.COMPLETED || state == Constants.UPLOAD_STATUS.ERROR) {
          n.modifiedDate = new Date();
        }
      }
    });
    this.dispatchNotifications(this.notifications);
  }

  public addNotification(newNotification: ISlideNotification) {
    this.notifications.unshift(newNotification);
    this.dispatchNotifications(this.notifications);
  }

  public removeNotification(id: string) {
    let i = this.notifications.findIndex(n => n.id == id);
    if (i > -1) {
      this.notifications.splice(i, 1);
      this.dispatchNotifications(this.notifications);
    }
  }

  public removeCompleted() {
    this.notifications = this.notifications.filter(n => 
      n.state==Constants.UPLOAD_STATUS.UPLOADING || n.state==Constants.UPLOAD_STATUS.PROCESSING);
    this.dispatchNotifications(this.notifications);
  }
}
