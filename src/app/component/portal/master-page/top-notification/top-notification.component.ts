import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/shared/constants/constant.class';
import { NotificationAPIService } from './../../../../service/notification-service';
@Component({
  selector: 'app-top-notification',
  templateUrl: './top-notification.component.html',
  styleUrls: ['./top-notification.component.scss']
})
export class TopNotificationComponent implements OnInit {
  Constant = Constant;
  topNotifications: any = null;
  totalTopNotifications: number = 0;
  constructor(private notificationAPIService: NotificationAPIService ) { }


  ngOnInit(): void {
    this.getTopNotifications();
  }

  private getTopNotifications() {
    this.notificationAPIService.getTopNotifications().subscribe(res => {
      if (res !== null) {
        this.topNotifications = res.data;
        this.totalTopNotifications = res.total;
      }
    }, error => {
      this.topNotifications = [];
      this.totalTopNotifications = 0;
    });
  }

}
