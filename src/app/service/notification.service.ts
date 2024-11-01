import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NotificationType } from '../enums/notification-type.enum';
import { NavigationService } from 'src/app/service/navigation.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private notification: NzNotificationService,
    private navigationService: NavigationService,
  ) {
  }
  showNotification(type: string, message: string) {
    this.notification.create(
      type,
      message,
      null,
      {
        nzStyle: {
          fontWeight: 'lighter',
          fontSize: 'larger'
        },
        nzDuration: 5000,
      }
    );
  }

  public handleViewDetailNotify(itemNotify?: any) {
    this.navigationService.navigateToNotifications(itemNotify.id);
    switch (itemNotify.notificationType) {
      case NotificationType.RequestBooking:
        this.navigationService.navigateToPageRequestBooking(itemNotify.otherId);
        break;

      case NotificationType.BookingHotel:
        this.navigationService.navigateToPageHotelBooking(itemNotify.otherId);
        break;

      case NotificationType.BusinessDetail:
        this.navigationService.navigateToPageCompanyUpdate(itemNotify.otherId);
        break;

      default:
        break;
    }
  }
}
