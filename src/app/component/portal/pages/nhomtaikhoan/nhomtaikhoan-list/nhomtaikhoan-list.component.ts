import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { Constant } from 'src/app/shared/constants/constant.class';
import { AppConfigService } from 'src/app-config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nhomtaikhoan-list',
  templateUrl: './nhomtaikhoan-list.component.html',
  styleUrls: ['./nhomtaikhoan-list.component.scss']
})
export class NhomtaikhoanListComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  datas: any[] = [];
  filteredDatas = [];
  searchText = "";

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
  pageSize: any;
  page: any;
  defaultPage: any;
  formAdd: FormGroup;
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
    this.get();
  }
  ngOnDestroy(): void {

  }
  getListData() {
    this.loading = true;
    this.generalService.getGroup().subscribe(res => {
      if (res !== null) {
        this.datas = res;
        this.filteredDatas = res;
        this.loading = false;
        super.setListOfAllData(this.datas);
      }
    }, error => {

    });
  }
  get() {
    this.translate.use(this.translate.currentLang).subscribe(data => {
      this.data = data;
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
    if (formValue.id == 0) {
      delete formValue.id;
      this.generalService.addGroup(formValue).subscribe(res => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
          formValue.id = 0;
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
        //this.isVisibleAdd = false;
        // console.log('res', res);
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
  onSearch() {
    let keyword = this.searchText.trim();
    this.filteredDatas = this.datas.filter((en) =>
    en.name.trim().toLowerCase().includes(keyword))
  }
}
