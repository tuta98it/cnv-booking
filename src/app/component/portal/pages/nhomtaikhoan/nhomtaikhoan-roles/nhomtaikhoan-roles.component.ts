import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { AppConfigService } from 'src/app-config.service';
import { GeneralService } from 'src/app/service/general-service';
import { NotificationService } from 'src/app/service/notification.service';
import { Constant } from 'src/app/shared/constants/constant.class';
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents'

@Component({
  selector: 'app-nhomtaikhoan-roles',
  templateUrl: './nhomtaikhoan-roles.component.html',
  styleUrls: ['./nhomtaikhoan-roles.component.scss']
})
export class NhomtaikhoanRolesComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  datas: any[] = [];
  users: any[] = [];
  allUsers: any[] = [];
  data: any;
  isVisibleAdd: boolean;
  isVisibleUser: boolean;
  isVisibleUpdate: boolean;
  item: any;
  loading: boolean;
  checkDelete = true;
  checkAdd = true;
  checkUpdate = true;
  saveDisable = true;
  pageSize: any;
  page: any;
  defaultPage: any;
  formAdd: FormGroup;
  allRoles: any[];
  groupRoles = [];
  searchText = "";
  filteredDatas = [];
  scrollX = "";
  constructor(
    public translate: TranslateService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private actionsSubject$: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder
  ) {
    super('id');
    this.formAdd = this.fb.group({
      id: [null],
      name: [null],
      description: [null],
    });
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.getListData();
    this.getAllRole();
    this.get();
    //this.initTableHeight(15000);
  }
  ngOnDestroy(): void {

  }
  getListData() {
    this.loading = true;
    this.generalService.getGroup().subscribe(res => {
      if (res !== null) {
        res.forEach(group => group.saveDisable = true);
        this.datas = res;
        this.filteredDatas = res;
        this.loading = false;
        super.setListOfAllData(this.datas);
      }
    }, error => {

    });
  }
  getAllRole() {
    this.generalService.getRole().subscribe(res => {
      if (res !== null) {
        this.allRoles = res;
        this.scrollX = this.allRoles.length * 100 + 400 + 'px';
        this.allRoles.sort((a, b) => a.groupName.localeCompare(b.groupName));
        //let groupRoles = [];
        this.allRoles.forEach(en => {
          if (en.groupName) {
            let exist = this.groupRoles.find(x => x.groupName == en.groupName);
            if (exist) {
              exist.roles = [...exist.roles, en];
              exist.thWidth += 100;
            }
            else {
              this.groupRoles.push({ groupName: en.groupName, roles: [en], thWidth: 100 });
            }
          }
        })

      }
    }, error => {

    });
  }
  get() {
    this.translate.use(this.translate.currentLang).subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }
  showConfirm(id): void {
    this.get();
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bạn có muốn xóa hay không?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Bỏ qua',
      nzOnOk: () => this.deleteItem(id)
    });
  }
  deleteItem(id) {
    this.generalService.deleteGroup(id).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_DELETE_SUCCESS);
      this.getListData();
    }, error => {

    });
  }
  showModalAdd() {
    this.isVisibleAdd = true;
    this.formAdd.patchValue({
      id: 0,
      name: '',
      managerId: 0,
      description: '',
    });
  }
  showModalUser(data) {
    this.isVisibleUser = true;
    this.item = data;
    this.users = this.item.userGroup;
  }
  showModalUpdate(data) {
    this.isVisibleAdd = true;
    this.item = data;
    this.users = this.item.userGroup;

    this.formAdd.patchValue({
      id: this.item.id,
      name: this.item.name,
      description: this.item.description,
    });

  }
  handleCancel() {
    this.isVisibleAdd = false;
  }
  handleOk() {
    const formValue = this.formAdd.value;
    // console.log(formValue);
    if (formValue.id === 0) {
      delete formValue.id;
      this.generalService.addGroup(formValue).subscribe(res => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        }
        else {
          this.getListData();
          this.isVisibleAdd = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, error => {

      });
    }
    else {
      this.generalService.updateGroup(formValue).subscribe(res => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        }
        else {
          this.getListData();
          this.isVisibleAdd = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      });
    }
  }
  closeModalUsers() {
    this.isVisibleUser = false;
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
  getManager(manager) {
    if (manager == null)
      return '';
    return manager.firstName + ' ' + manager.lastName;
  }

  checkUserReport(roleId, group) {
    return group.groupRoles.filter(item => item.roleId === roleId).length >= 1;
  }

  isCheckAllUserReport(group: any) {
    return this.allRoles.map(r => r.id).every(roleId => group.groupRoles.map(r => r.roleId).includes(roleId));
  }

  onAllCheckUserReport(isCheck: boolean, group: any) {
    group.groupRoles = [];
    if(isCheck == true){
      group.groupRoles = this.allRoles.map(role => ({ roleId: role.id }));
    }
  }

  updateUserGroup(group, roleId, status) {
    if (!group.roles) {
      group.roles = [];
      for (let i = 0; i < group.groupRoles.length; i++) {
        group.roles.push((group.groupRoles[i].roleId));
      }
    }
    if (status === 0) {
      group.roles = group.roles.filter(item => item !== roleId);
    } else {
      var role = group.roles.filter(item => item === roleId);
      if (role.length === 0)
        group.roles.push(roleId);
    }
    group.saveDisable = false;

    group.groupRoles = group.roles.map(roleId => ({ roleId }));
    this.isCheckAllUserReport(group);
  }
  saveUserGroup(data) {
    var itemUpdate = { groupId: data.id, roles: data.roles };
    this.generalService.updateGroupRole(itemUpdate).subscribe(res => {
      if (res.ret && res.ret[0].code !== 0) {
        this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
      }
      else {
        data.saveDisable = true;
        this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
      }
    }, error => {

    });
  }
  onSearch() {
    let keyword = removeAccents(this.searchText.trim());
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.name.trim()).toLowerCase().includes(keyword));
  }
}
