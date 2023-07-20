import {Component, OnDestroy, OnInit} from '@angular/core';

import { Router, NavigationEnd, ActivatedRoute, NavigationStart} from '@angular/router';
import {Constant} from '../../shared/constants/constant.class';
import * as fromAuth from '../../component/auth/redux/auth.reducer';
import * as actionAuth from '../../component/auth/redux/auth.action';
import {ActionsSubject, select, Store} from '@ngrx/store';
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {MenuService} from '../../service/menu.service';
import {Menu} from '../../model/menu.class';
import {AuthService} from '../../service/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {Cookie} from "ng2-cookies";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit , OnDestroy {
  static readonly ROUTE_DATA_PAGENAME = 'pagename';

  isCollapsed = false;
  username: string;
  sub: Subscription;
  menus: Menu[] = [];
  groupMenu: any[] = [];
  groupName: any[] = [];
  group: any[] = [];
  selectedMenu: Menu;
  pageName: string;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<fromAuth.AppState>,
    private actionsSubject$: ActionsSubject,
    private menuService: MenuService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    this.username = userInfo.username; 
    this.menus = userInfo.menus; this.getGroupMenu();
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getPageInfo())).subscribe((pageName: string) => {
      this.pageName = this.translate.instant(pageName);
    });
    this.pageName = this.translate.instant(this.getPageInfo());
    this.authService.checkToken().subscribe(res => {
      if (res.ret && res.ret.code === 401) {
        localStorage.removeItem(Constant.TOKEN);
        localStorage.removeItem(Constant.USER_INFO);
        this.route.navigate(['/login']);
      }
      /*localStorage.removeItem(Constant.TOKEN);
      localStorage.removeItem(Constant.USER_INFO);
      this.route.navigate(['/login']);*/
    });

    /*this.sub = this.actionsSubject$.pipe(filter((action: any) => action.type === actionAuth.AuthActionTypes.Logout)).subscribe(action => {
    });
    this.getMenuByUser();
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getPageInfo())).subscribe((pageName: string) => {
        this.pageName = this.translate.instant(pageName);
      });
    this.pageName = this.translate.instant(this.getPageInfo());*/
  }
  getMenuByUser() {
    this.menuService.getMenuByUser().subscribe(res => {
      this.menus = res;
    });
  }
  getGroupMenu() {
    for (let index = 0; index < this.menus.length; index++) {
      if (index > 0 && this.menus[index].path == "") {
        this.groupMenu.push(this.group);
        this.group = [];
      }
      if (this.menus[index].path == "") {
        this.groupName.push(this.menus[index].name);
      }
      else {
        this.group.push(this.menus[index]);
      }
    }
    this.groupMenu.push(this.group);
    return this.groupMenu, this.groupName;
  }

  private getPageInfo() {
    let child = this.activeRoute.firstChild;
    while (child.firstChild) {
        child = child.firstChild;
    }
    if (child.snapshot.data[AdminLayoutComponent.ROUTE_DATA_PAGENAME]) {
        return child.snapshot.data[AdminLayoutComponent.ROUTE_DATA_PAGENAME];
    }
    return '';
  }
  logout() {
    /*Cookie.delete(Constant.TOKEN);
    this.route.navigate(['/login']);
    return;*/
   // this.store.dispatch(new actionAuth.Logout());
    this.sub = this.authService.logout().subscribe(res => {
      localStorage.removeItem(Constant.TOKEN);
      localStorage.removeItem(Constant.USER_INFO);
      this.route.navigate(['/login']);
    });
  }
}
export function clearState(reducer) {
  return (state, action) => {
    if (action.type === actionAuth.AuthActionTypes.Logout) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
