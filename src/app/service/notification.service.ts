import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NotificationType } from '../enums/notification-type.enum';
import { NavigationService } from 'src/app/service/navigation.service';
import { GeneralService } from './general-service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private notification: NzNotificationService,
    private navigationService: NavigationService,
    private generalService: GeneralService,
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

      case NotificationType.AccountDepositHistory:
        console.log(itemNotify);

        this.generalService.getPartnerByAccountDepositId(itemNotify.otherId).subscribe({
          next: (partner: any) => {
            this.navigationService.navigateToPageCompanyUpdateAccountInfo(partner.id);
          },

          error: (err) => {


          },

          complete: () => {

          }
        })

        break;

      case NotificationType.WhenCustomerRate:
      case NotificationType.RatingBookingAirline:
      case NotificationType.RatingBookingHotel:
      case NotificationType.RatingRequestBooking:
        this.navigationService.navigateToPageRating(itemNotify.otherId);

        break;
      default:
        this.navigationService.navigateToNotifications(itemNotify.id);
        break;
    }
  }


}
