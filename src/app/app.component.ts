import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from './service/loader.service';
import { Subject } from 'rxjs';
import { Action } from './model/action.model';
import { MenuStateService } from './shared/app-state/menu-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  action: Action;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef, private menuStateService: MenuStateService, private router: Router) { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
    if (this.router.url === '/booking-service/airline-ticket-booking-request/confirm-reserve-seat') {
      this.menuStateService.dispatch(false);
    } else {
      this.menuStateService.dispatch(true);
    }
  }
}
