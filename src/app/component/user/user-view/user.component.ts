import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../service/user-service';
import {User} from '../../../model/user.class';
import {SearchUser} from '../../../model/searchUser.class';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationService} from '../../../service/notification.service';
import {Constant} from '../../../shared/constants/constant.class';
import {LoaderService} from '../../../service/loader.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {Role} from '../../../model/role.class';
import {Group} from '../../../model/group.class';
import * as fromGroup from '../../group/redux/group.reducer';
import * as fromRole from '../../role/redux/role.reducer';
import * as actionRole from '../../role/redux/role.action';
import * as actionGroup from '../../group/redux/group.action';
import {CheckAction} from '../../../shared/constants/check-action.class';
import { AppConfigService } from 'src/app-config.service';
import {NzModalService} from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  users: User [] = [];
  loading = true;
  total: number;
  search: SearchUser = new SearchUser();
  formSearch: FormGroup;
  isVisible = false;
  isVisibleAdd = false;
  data: any;
  sub: Subscription;
  user: User;
  roles: Role[] = [];
  groups: Group[] = [];
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  a = new Set();
  pageSize: any;
  page: any;
  defaultPage: any;
  listPermission: any;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    public loaderService: LoaderService,
    public translate: TranslateService,
    public store: Store<fromGroup.AppState>,
    private configService: AppConfigService
  ) {
    this.formSearch = this.fb.group({
      name: null,
      email: null,
      mobile: null,
      groupId: null,
      status: null
    });
  }
  ngOnInit(): void {
    this.getListPermission();
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.search.page = this.page;
    this.search.pageSize = this.defaultPage;
    this.search.sortType = true;
    this.searchData();
    this.getListRole();
    this.getListGroup();
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
  get() {
    this.translate.use(this.translate.currentLang).subscribe(data => {
      this.data = data;
    });
  }
  getListRole() {
    this.store.dispatch(new actionRole.GetRoleLoad());
    this.store.dispatch(new actionGroup.GetGroupLoad());
    this.store.pipe(select(fromRole.getRole)).subscribe(res => {
      this.roles = res;
    });
    this.store.pipe(select(fromGroup.getGroup)).subscribe(res => {
      this.groups = res;
    });
  }
  getListGroup() {
  }
  searchData(reset: boolean = false): void {
    this.loading = true;
    if (reset) {
      this.search.page = 1;
    }

    this.userService.getUser(this.search).subscribe(res => {
      this.users = res.data;
      this.total = res.recordsTotal;
      this.loading = false;
    });
  }

  onSubmit() {
    this.search.email = this.formSearch.get('email').value;
    this.search.name = this.formSearch.get('name').value;
    this.search.phone = this.formSearch.get('mobile').value;
    this.search.groupId = this.formSearch.get('groupId').value;
    this.search.status = this.formSearch.get('status').value;
    this.searchData(true);
  }
  showConfirm(data): void {
    this.get();
    this.modalService.confirm({
      nzTitle: this.data.title_confirm_delete,
      nzContent: this.data.content_confirm_delete,
      nzOkText: this.data.ok,
      nzCancelText: this.data.cancel,
      nzOnOk: () => this.deleteUser(data)
    });
  }
  deleteUser(data) {
    this.userService.deleteUser(data.userId).subscribe(res => {
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_DELETE_SUCCESS);
        this.searchData(true);
    });
  }
  showModal(data): void {
    this.isVisible = true;
    this.user = data;
  }
  closeModalUpdate(value) {
    this.isVisible = value;
  }
  updateUser(value) {
    this.isVisible = false;
    this.sub = this.userService.updateUser(value).subscribe(data => {
      if (data != null) {
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        this.searchData(true);
      }
    });
  }
  showModalAdd() {
    this.isVisibleAdd = true;
  }
  addUser(value) {
    this.isVisibleAdd = false;
    this.sub = this.userService.addUser(value).subscribe(data => {
      if (data != null) {
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        this.searchData(true);
      }
    });
  }
  closeModalAdd(value) {
    this.isVisibleAdd = value;
  }
}
