import { Component, OnInit } from '@angular/core';
import { NotificationAPIService } from 'src/app/service/notification-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/shared/constants/constant.class';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  readonly allowedPageSizes = [20, 50, 100, 200, 500, 'all']
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  loading: boolean;
  constructor(
    private notificationAPIService: NotificationAPIService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    this.handleGetListNotifications();
  }



  private handleGetListNotifications() {
    this.getListNotifications().then((result: any) => {

    }).catch((error: any) => {

    })
  }



  private getListNotifications() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.notificationAPIService.getAllNotifications().subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              resolve(true);
            } else {
              if (res.errors && res.errors.length > 0) {
                res.errors.forEach((el: any) => {
                  this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
                });
              } else {
              }
              reject(res.errors);
            }
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
          }
        }
      ).add(() => {
      });
    });
  }
}
