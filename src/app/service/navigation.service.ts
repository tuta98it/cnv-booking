// navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constant, NotificationConfig, RequestBookingConfig } from '../shared/constants/constant.class';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateToNotifications(idNotify?: number) {
    this.router.navigate([`/${NotificationConfig.PATH_NOTIFICATION}`], { queryParams: { [Constant.ID]: idNotify } });
  }

  navigateToPageRequestBooking(idRequestBooking?: number) {
    this.router.navigate([`/${RequestBookingConfig.PATH_REQUEST_BOOKING}`], { queryParams: { [Constant.ID]: idRequestBooking } });
  }

  navigateToPageHotelBooking(idHotelBooking?: number) {
    this.router.navigate([`/${RequestBookingConfig.PATH_REQUEST_BOOKING}`], { queryParams: { [Constant.ID]: idHotelBooking } });
  }
}
