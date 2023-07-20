import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionsSubject, select, Store} from '@ngrx/store';
import {Role} from '../../../model/role.class';
import {TranslateService} from '@ngx-translate/core';
import {Constant} from '../../../shared/constants/constant.class';
import {NotificationService} from '../../../service/notification.service';
import {RoleService} from '../../../service/role-service';
import {Subscription} from 'rxjs';
import * as fromRole from '../redux/role.reducer';
import {filter} from 'rxjs/operators';
import {RoleAction} from '../redux/role.action';
import * as roleAction from '../redux/role.action';
import {LoaderService} from '../../../service/loader.service';
import { AppConfigService } from 'src/app-config.service';
import {CheckAction} from '../../../shared/constants/check-action.class';
import {NzModalService} from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {
  roles: Role[] = [];
  data: any;
  isVisibleAdd: boolean;
  isVisibleUpdate: boolean;
  role: Role;
  sub: Subscription;
  loading: boolean;
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  listPermission: any;
  constructor(
    public store: Store<fromRole.AppState>,
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private roleService: RoleService,
    private actionsSubject$: ActionsSubject,
    public loaderService: LoaderService,
    private configService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.getListPermission();
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.getListRole();
    this.get();
    this.sub = this.actionsSubject$.pipe(filter((action: any) => action.type === RoleAction.DeleteRoleSuccess)).subscribe(action => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_DELETE_SUCCESS);
    });
    this.sub = this.actionsSubject$.pipe(filter((action: any) => action.type === RoleAction.AddRoleSuccess)).subscribe(action => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
    });
  }
  getListPermission() {
    this.listPermission = CheckAction.getListPermission();
    this.checkAdd = this.listPermission.has(Constant.CREATE);
    this.checkDelete = this.listPermission.has(Constant.DELETE);
    this.checkUpdate = this.listPermission.has(Constant.UPDATE);
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  getListRole() {
    this.loading = true;
    this.store.dispatch(new roleAction.GetRoleLoad());
    this.store.pipe(select(fromRole.getRole)).subscribe(res => {
      this.roles = res;
      this.loading = false;
    });
  }
  get() {
    this.translate.use(this.translate.currentLang).subscribe(data => {
      this.data = data;
    });
  }
  showConfirm(data): void {
    this.get();
    this.modalService.confirm({
      nzTitle: this.data.title_confirm_delete,
      nzContent: this.data.content_confirm_delete,
      nzOkText: this.data.ok,
      nzCancelText: this.data.cancel,
      nzOnOk: () => this.deleteRole(data)
    });
  }
  deleteRole(data) {
    this.store.dispatch(new roleAction.DeleteRole(data));
  }
  showModalAdd() {
    this.isVisibleAdd = true;
  }
  showModalUpdate(data) {
    this.isVisibleUpdate = true;
    this.role = data;
  }
  closeModalAdd(value) {
    this.isVisibleAdd = value;
  }
  closeModalUpdate(value) {
    this.isVisibleUpdate = value;
  }
  addRole(value) {
    this.isVisibleAdd = value;
}
}
