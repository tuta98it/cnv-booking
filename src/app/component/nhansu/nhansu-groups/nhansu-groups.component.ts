import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GeneralService} from '../../../service/general-service';
import {AppConfigService} from '../../../../app-config.service';
import {NotificationService} from '../../../service/notification.service';
import {Constant} from '../../../shared/constants/constant.class';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-nhansu-groups',
  templateUrl: './nhansu-groups.component.html',
  styleUrls: ['./nhansu-groups.component.scss']
})
export class NhansuGroupsComponent implements OnInit, OnChanges {
  @Input() nhansu: any;
  user: any;
  @Input() isVisible: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  userId: any;
  groups: any[];
  formAdd: FormGroup;
  pageSize: any;
  page: any;
  defaultPage: any;
  loading: boolean;
  groupsInUser: any[];
  groupsRemains: any[];
  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder,
    private configService: AppConfigService,
    private modalService: NzModalService,
    private notificationService: NotificationService,
  ) {
    this.formAdd = this.fb.group({
      groupId: [null]
    });
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;

  }
  ngOnChanges(): void {

    if (this.nhansu) {
      this.user = this.nhansu.user;
      this.groupsInUser = this.user.userGroup;
      this.getListGroupData();
    }
  }
  getListGroupData() {
    this.generalService.getGroup().subscribe(res => {
      if (res !== null) {
        this.groups = res;
        console.log('groups', res);
      }
    }, error => {

    });
  }
  showConfirm(id): void {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Bạn có muốn xóa hay không.',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Bỏ qua',
      nzOnOk: () => this.removeUserFromGroup(this.user.id, id)
    });
  }
  handleOk() {
    const formValue = this.formAdd.value;
    this.addGroupToUser(formValue.groupId, this.user.id);
  }
  handleCancel() {
    this.isVisible = false;
    this.closeModal.emit(true);
  }
  addGroupToUser(groupId, userId) {
    const checkExists = this.groupsInUser.filter(g => g.group.id === groupId);
    if (checkExists.length > 0) {
      this.notificationService.showNotification(Constant.ERROR, 'Nhóm đã được thêm');
      return;
    }

    const params = { userId: userId, groupId: groupId };
    this.generalService.addUserToGroup(params).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);

      const groupAdd = this.groups.filter(g => g.id === groupId);
      if (groupAdd.length > 0) {
        this.groupsInUser.push();

        const groupAddItem = {groupId: groupId, userId: userId, group: groupAdd[0]};
        this.groupsInUser = [
          ...this.groupsInUser,
          groupAddItem
        ];

        console.log(this.groupsInUser);
        this.formAdd.patchValue({
          groupId: null,
        });
      }
    }, error => {

    });
  }

  removeUserFromGroup(userId, groupId) {
    const params = { userId: userId, groupId: groupId };
    this.generalService.removeUserFromGroup(params).subscribe(res => {
      this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_DELETE_SUCCESS);

      this.groupsInUser = this.groupsInUser.filter(g => g.group.id !== groupId);
      this.user.userGroup = this.groupsInUser;
    }, error => {

    });
  }
  getRowIndex = (index, pageIndex, pageSize) => index + 1 + pageSize * (pageIndex - 1);
  getListGroupOfUser(userId: any) {

  }
}
