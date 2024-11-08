import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Constant, HotelBookingConfig, NotificationConfig, PartnerConfig, RequestBookingConfig } from '../shared/constants/constant.class';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router, private ngZone: NgZone) {}

  navigateToNotifications(idNotify?: number) {
    this.ngZone.run(() => {
      this.router.navigate([`/${NotificationConfig.PATH_NOTIFICATION}`], { queryParams: { [Constant.ID]: idNotify } });
    });
  }

  navigateToPageRequestBooking(idRequestBooking?: number) {
    const url = `/${RequestBookingConfig.PATH_REQUEST_BOOKING}`;
    this.ngZone.run(() => {
      if (this.router.url.includes(RequestBookingConfig.PATH_REQUEST_BOOKING)) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([url], { queryParams: { [Constant.ID]: idRequestBooking } });
        });
      } else {
        this.router.navigate([url], { queryParams: { [Constant.ID]: idRequestBooking } });
      }
    });
  }

  navigateToPageHotelBooking(idHotelBooking?: number) {
    const url = `/${HotelBookingConfig.PATH_HOTEL_BOOKING}`;
    this.ngZone.run(() => {
      if (this.router.url.includes(HotelBookingConfig.PATH_HOTEL_BOOKING)) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([url], { queryParams: { [Constant.ID]: idHotelBooking } });
        });
      } else {
        this.router.navigate([url], { queryParams: { [Constant.ID]: idHotelBooking } });
      }
    });
  }

  navigateToPageCompanyUpdate(idPartner?: number) {
    this.ngZone.run(() => {
      this.router.navigate([`/${PartnerConfig.PATH_PARTNER}`], { queryParams: { [Constant.ID]: idPartner } });
    });
  }
}
