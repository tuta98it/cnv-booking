// navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constant, HotelBookingConfig, NotificationConfig, PartnerConfig, RequestBookingConfig } from '../shared/constants/constant.class';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateToNotifications(idNotify?: number) {

    this.router.navigate([`/${NotificationConfig.PATH_NOTIFICATION}`], { queryParams: { [Constant.ID]: idNotify } });
  }

  navigateToPageRequestBooking(idRequestBooking?: number) {

    const url = `/${RequestBookingConfig.PATH_REQUEST_BOOKING}`;

    console.log(this.router.url);

    if (this.router.url.includes(RequestBookingConfig.PATH_REQUEST_BOOKING)) {
      // Navigate to a temporary URL and then back to the notifications URL to force a reload
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([url], { queryParams: { [Constant.ID]: idRequestBooking } });
      });
    } else {
      this.router.navigate([url], { queryParams: { [Constant.ID]: idRequestBooking } });
    }

    // this.router.navigate([`/${RequestBookingConfig.PATH_REQUEST_BOOKING}`], { queryParams: { [Constant.ID]: idRequestBooking } });
  }

  navigateToPageHotelBooking(idHotelBooking?: number) {

    const url = `/${HotelBookingConfig.PATH_HOTEL_BOOKING}`;

    console.log(this.router.url);

    if (this.router.url.includes(HotelBookingConfig.PATH_HOTEL_BOOKING)) {
      // Navigate to a temporary URL and then back to the notifications URL to force a reload
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([url], { queryParams: { [Constant.ID]: idHotelBooking } });
      });
    } else {
      this.router.navigate([url], { queryParams: { [Constant.ID]: idHotelBooking } });
    }

    // this.router.navigate([`/${HotelBookingConfig.PATH_HOTEL_BOOKING}`], { queryParams: { [Constant.ID]: idHotelBooking } });
  }

  navigateToPageCompanyUpdate(idPartner?: number) {
    this.router.navigate([`/${PartnerConfig.PATH_PARTNER}`], { queryParams: { [Constant.ID]: idPartner } });
  }
}
