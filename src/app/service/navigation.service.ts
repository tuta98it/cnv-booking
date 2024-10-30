// navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../shared/constants/constant.class';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  navigateToNotifications(idNotify?: number) {
    this.router.navigate(['/notifications'], { queryParams: { [Constant.ID]: idNotify } });
  }
}
