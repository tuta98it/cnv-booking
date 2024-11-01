import { Constant } from 'src/app/shared/constants/constant.class';
import { NotificationAPIService } from './../../../../service/notification-service';
import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from '../../../../service/general-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../service/notification.service';
import { DatePipe } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Menu } from '../../../../model/menu.class';
import { ActionsSubject, Store } from '@ngrx/store';
import * as fromAuth from '../../../auth/redux/auth.reducer';
import { MenuService } from '../../../../service/menu.service';
import { AuthService } from '../../../../service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminLayoutComponent } from '../../../admin-layout/admin-layout.component';
import { FileManagerService } from '../../../../service/file-manager.service';
import { UserType } from 'src/app/enums/user-type.enum';
import { MenuStateService } from 'src/app/shared/app-state/menu-state.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColorStatusNotifications, NotificationVHLEnum } from 'src/app/enums/notification-vhl.enum';
import { NavigationService } from 'src/app/service/navigation.service';

@Component({
  selector: 'app-top-notification',
  templateUrl: './top-notification.component.html',
  styleUrls: ['./top-notification.component.scss']
})
export class TopNotificationComponent implements OnInit {
  Constant = Constant;
  topNotifications: any = null;
  totalTopNotifications: number = 0;
  ColorStatusNotifications = ColorStatusNotifications;
  NotificationVHLEnum = NotificationVHLEnum;
  totalUnRead: number;
  constructor(
    private notificationAPIService: NotificationAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private fileManagerService: FileManagerService,
    private notificationService: NotificationService,
    private activeRoute: ActivatedRoute,
    private msg: NzMessageService,
    private navigationService: NavigationService
  ) { }


  ngOnInit(): void {
    this.getTopNotifications();
  }

  public getTopNotifications() {
    this.notificationAPIService.getTopNotifications().subscribe(res => {
      if (res !== null) {
        this.topNotifications = res.data;
        this.totalTopNotifications = res.total;
        this.totalUnRead = res.totalUnRead;


      }
    }, error => {
      this.topNotifications = [];
      this.totalTopNotifications = 0;
    });
  }


  handleClickItemTopNotify(notifyItem: any) {
    // this.handleNavigatePageNotifications(notifyItem.id);
    this.handleViewDetailNotify(notifyItem);
    this.readedNotify(notifyItem);
  }

  private handleViewDetailNotify(itemNotify?: any) {
    this.notificationService.handleViewDetailNotify(itemNotify);
  }

  private readedNotify(notifyItem: any) {
    let notificationIds: number[] = [
      notifyItem.id,
    ];
    if (notifyItem.readed != true) {
      this.readedNotificationByIds(notificationIds).then((result: any) => {
      }).catch((error: any) => {
      });
    }
  }

  public handleReadedAllNotifications() {
    let notificationIds: number[] = this.topNotifications.map((topNotify: any) => topNotify.id);
    this.readedNotificationByIds(notificationIds).then((result: any) => {
      // this.notificationService.showNotification(Constant.SUCCESS, 'Đã gửi email thông báo giữ phòng khách sạn tới khách hàng');
    }).catch((error: any) => {
      // this.notificationService.showNotification(Constant.ERROR, 'Gửi email thông báo giữ phòng khách sạn tới khách hàng không thành công');
    });
  }




  public handleNavigatePageNotifications(idNotify?: number) {
    this.navigationService.navigateToNotifications(idNotify);
  }


  private readedNotificationByIds(idNotifications: number[]) {
    return new Promise((resolve, reject) => {
      this.notificationAPIService.readNotificationByIds(idNotifications).subscribe(
        {
          next: (res: any) => {
            if (res.isValid) {
              resolve(res.data);
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
        this.getTopNotifications();
      });
    });
  }


}
