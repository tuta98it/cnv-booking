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
  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef, private menuStateService: MenuStateService, private router: Router,
  ) {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
            scope: "/",
          });
          if (registration.installing) {
            console.log("Service worker installing");
          } else if (registration.waiting) {
            console.log("Service worker installed");
          } else if (registration.active) {
            console.log("Service worker active");
          }
        } catch (error) {
          console.error(`Registration failed with ${error}`);
        }
      }
    };
    registerServiceWorker();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit(): void {
  }
}
