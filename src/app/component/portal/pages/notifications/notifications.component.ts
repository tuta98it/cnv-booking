import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ColorStatusNotifications, ColorTextViewDetailNotifications, NotificationVHLEnum } from 'src/app/enums/notification-vhl.enum';
import { NotificationAPIService } from 'src/app/service/notification-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/shared/constants/constant.class';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewInit{
  @ViewChild('gridContainer', { static: false }) gridNotification: DxDataGridComponent;
  allMode: string;
  checkBoxesMode: string;

  NotificationVHLEnum = NotificationVHLEnum;
  ColorStatusNotifications = ColorStatusNotifications;
  ColorTextViewDetailNotifications = ColorTextViewDetailNotifications;
  dxGridHeight: any;
  currentFilter: any;

  readonly allowedPageSizes = [20, 50, 100, 200, 500, 'all']
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  loading: boolean;
  totalAllNotifications: number = 0;
  listAllNotifications: any[];
  Constant = Constant;
  constructor(
    private notificationAPIService: NotificationAPIService,
    private notificationService: NotificationService,

  ) {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';
  }

  ngOnInit(): void {
    this.handleGetListNotifications();
  }

  ngAfterViewInit() {
    // Now the grid reference will be available
  }


  private handleGetListNotifications() {
    this.getListNotifications().then((result: any) => {
      this.listAllNotifications = result.data;
      this.totalAllNotifications = result.total;
    }).catch((error: any) => {

    });
  }


  public handleMaskAsReadNotifications() {
    const selectedRows = this.gridNotification.instance.getSelectedRowsData();
    const selectedRowsUnreaded = selectedRows.filter(e => e.readed != true);
    if(selectedRowsUnreaded == null || selectedRowsUnreaded == undefined || selectedRowsUnreaded?.length == 0){
      // Đánh dấu những thông báo nào chưa đọc
      return;
    }
    let notificationUnreadIds = selectedRowsUnreaded.map(e => e.id);
    this.readedNotificationByIds(notificationUnreadIds).then(result => {
      this.handleGetListNotifications();
    }).catch(error => {

    });

  }

  private getListNotifications() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.notificationAPIService.getAllNotifications().subscribe(
        {
          next: (res: any) => {
            if (res.total > 0) {
              let stt = 0;
              res.data.forEach(notify => {
                notify.stt = ++stt;
              });
              resolve(res);
            }
            // else {
            //   if (res.errors && res.errors.length > 0) {
            //     res.errors.forEach((el: any) => {
            //       this.notificationService.showNotification(Constant.ERROR, el.errorMessage);
            //     });
            //   } else {
            //   }
            //   reject(res.errors);
            // }
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

  private readedNotificationByIds(idNotifications: number[]) {
    return new Promise((resolve, reject) => {
      this.notificationAPIService.readNotificationByIds(idNotifications).subscribe(
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
