import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GeneralService} from '../../../../../service/general-service';
import {AppConfigService} from '../../../../../../app-config.service';
import {NotificationService} from '../../../../../service/notification.service';
import {Constant} from '../../../../../shared/constants/constant.class';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-nhomtaikhoan-users',
  templateUrl: './nhomtaikhoan-users.component.html',
  styleUrls: ['./nhomtaikhoan-users.component.scss']
})
export class NhomtaikhoanUsersComponent implements OnInit, OnChanges {
  @Input() nhomtaikhoan: any;
  @Input() isVisible: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  userId: any;
  users: any[];
  formAdd: FormGroup;
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;
  usersInGroup: any[];

  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder,
    private configService: AppConfigService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
  ) {
    this.formAdd = this.fb.group({
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
  }

  ngOnChanges(): void {
    if (this.nhomtaikhoan) {
      this.getListUserOfGroup(this.nhomtaikhoan.id);
    }
  }

  showConfirm(id): void {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bạn có muốn xóa hay không.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Bỏ qua',
      nzOnOk: () => this.removeUserFromGroup(id, this.nhomtaikhoan.id)
    });
  }

  handleOk() {
    const formValue = this.formAdd.value;
    this.addUserToGroup(formValue.userId, this.nhomtaikhoan.id);
  }

  handleCancel() {
    this.isVisible = false;
    this.closeModal.emit(true);
  }

  addUserToGroup(userId, groupId) {
    const params = {userId, groupId};
    this.generalService.addUserToGroup(params).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
      this.getListUserOfGroup(this.nhomtaikhoan.id);
      this.formAdd.patchValue({
        userId: null,
      });
    }, error => {

    });
  }

  removeUserFromGroup(userId, groupId) {
    const params = {userId: userId, groupId: groupId};
    this.generalService.removeUserFromGroup(params).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
      this.getListUserOfGroup(this.nhomtaikhoan.id);
    }, error => {

    });
  }

  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);

  getListUserOfGroup(groupId: any) {
    this.generalService.getUserOfGroup(groupId).subscribe(res => {
      if (res !== null) {
        // console.log("vao day");
        this.users = res.usersNotInGroup;
        this.usersInGroup = res.usersInGroup;
        console.log(this.users, this.usersInGroup);
      }
    }, error => {

    });
  }
}
