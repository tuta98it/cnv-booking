import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Constant, HotelBookingConfig, HotelConfig, NotificationConfig, PartnerConfig, RattingConfig, RequestBookingConfig } from '../shared/constants/constant.class';
import { NotificationAPIService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router, private ngZone: NgZone, private notificationAPIService: NotificationAPIService) { }

  navigateToNotifications(idNotify?: number) {
    const url = `/${NotificationConfig.PATH_NOTIFICATION}`;
    const fullUrl = this.router.serializeUrl(
      this.router.createUrlTree([url], { queryParams: { [Constant.ID]: idNotify } })
    );
    this.ngZone.run(() => {
      window.open(fullUrl, '_blank');
    });
  }

  navigateToPageRequestBooking(idRequestBooking?: number) {
    const url = `/${RequestBookingConfig.PATH_REQUEST_BOOKING}`;
    const fullUrl = this.router.serializeUrl(
      this.router.createUrlTree([url], { queryParams: { [Constant.ID]: idRequestBooking } })
    );

    this.ngZone.run(() => {
      window.open(fullUrl, '_blank');
    });
  }

  navigateToPageHotelBooking(idHotelBooking?: number) {
    const url = `/${HotelBookingConfig.PATH_HOTEL_BOOKING}`;
    const fullUrl = this.router.serializeUrl(
      this.router.createUrlTree([url], { queryParams: { [Constant.ID]: idHotelBooking } })
    );
    this.ngZone.run(() => {
      window.open(fullUrl, '_blank');  // Mở URL trong một tab mới
    });
  }

  navigateToPageCompanyUpdate(idPartner?: number) {

    const url = `/${PartnerConfig.PATH_PARTNER}`;
    const fullUrl = this.router.serializeUrl(
      this.router.createUrlTree([url], { queryParams: { [Constant.ID]: idPartner } })
    );
    this.ngZone.run(() => {
      window.open(fullUrl, '_blank');  // Mở URL trong một tab mới
    });

  }

  navigateToPageCompanyUpdateAccountInfo(idPartner?: number) {

    const url = `/${PartnerConfig.PATH_PARTNER_UPDATE_ACCINFO}`;
    const fullUrl = this.router.serializeUrl(
      this.router.createUrlTree([url], { queryParams: { [Constant.ID]: idPartner } })
    );
    this.ngZone.run(() => {
      window.open(fullUrl, '_blank');  // Mở URL trong một tab mới
    });


  }

  navigateToPageHotelDetail(idHotel?: number) {
    const fullUrl = `/${HotelConfig.PATH_HOTEL_VIEWEDIT}/${idHotel}`
    this.ngZone.run(() => {
      window.open(fullUrl, '_blank');  // Mở URL trong một tab mới
    });
  }

  navigateToPageRating(idRating?: number) {
    const url = `/${RattingConfig.PATH_RATING}`;
    const fullUrl = this.router.serializeUrl(
      this.router.createUrlTree([url], { queryParams: { [Constant.ID]: idRating } })
    );
    this.ngZone.run(() => {
      window.open(fullUrl, '_blank');  // Mở URL trong một tab mới
    });
  }

  navigateToPageRequestToDepositIntoAccount(idNotify?: number) {
    const url = `/${PartnerConfig.PATH_PARTNER_REQUEST_DEPOSIT_ACCOUNT}`;

    this.notificationAPIService.getNotificationRequestDepositAccountById(idNotify).subscribe(
      {
        next: async (res: any) => {
          if (res.isValid) {
            let notifyData = res.data;
            console.log(notifyData);

            var idPartner = notifyData.customerDepositHistory.partnerId;
            var customerDepositHistoryId = notifyData.otherId;
            const fullUrl = this.router.serializeUrl(
              this.router.createUrlTree([url], { queryParams: { [Constant.ID]: idPartner, [Constant.ID_CUSTOMER_DEPOSIT_HISTORY]: customerDepositHistoryId } })
            );
            this.ngZone.run(() => {
              window.open(fullUrl, '_blank');  // Mở URL trong một tab mới
            });

          } else {
          }
        },

        error: (error) => {
          console.log(error);
        },

        compile: () => {

        }
      }
    );

  }
}
