import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileManagerService} from '../../../../service/file-manager.service';
import {NotificationService} from '../../../../service/notification.service';
import {Constant} from '../../../../shared/constants/constant.class';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  bucketId: any;
  size = 'small';
  loading: boolean;
  datas: any[];
  selectionData: any;
  isVisible = false;
  isDisbled: boolean;
  rate: number;
  modalTitle = 'Edit Role';
  switchValue = false;
  gridHeight: any;
  constructor(
    private route: ActivatedRoute,
    private fileManagerService: FileManagerService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getListData();
  }
  getListData() {
    this.loading = true;
    this.fileManagerService.getRole().subscribe(res => {
      if (res !== null) {
        this.datas = res; // res.filter(en => en.bucketId === this.bucketId);
        // this.datas.sort((a, b) => (a.description > b.description) ? 1 : -1);
        // this.datas = res.sort((book1, book2) => {
        //   return this.compareObjects(book1, book2, 'description');
        // })
        this.loading = false;
        console.log(this.datas);
      }
    }, error => {

    });
    this.gridHeight = (window.innerHeight - 230) + 'px';
  }
  // compareObjects(object1, object2, key) {
  //   const obj1 = object1[key];
  //   const obj2 = object2[key];
  //
  //   if (obj1 < obj2) {
  //     return -1;
  //   }
  //   if (obj1 > obj2) {
  //     return 1;
  //   }
  //   return 0;
  // }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  showModal(data: any): void {
    this.isVisible = true;
    this.selectionData = data;
    this.selectionData = Object.assign({}, data);
    this.modalTitle = 'Edit Role';
    this.switchValue = this.selectionData.switchtelcode === 1;
  }
  handleOk() {
    if (!this.selectionData.name) {
      this.notificationService.showNotification(Constant.ERROR, 'Name must be fill');
      return;
    }
    if (!this.selectionData.descripion) {
      this.notificationService.showNotification(Constant.ERROR, 'Descripion must be fill');
      return;
    }
    this.isDisbled = true;
    this.selectionData.switchtelcode = this.switchValue ? 1 : 0;
    console.log(this.selectionData);
    if (this.selectionData.id === -1) {
      delete this.selectionData.id;
      this.fileManagerService.addRole(this.selectionData).subscribe(res => {
        this.isDisbled = false;
        if (res && res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisible = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_ADD_SUCCESS);
        }
      }, error => {

      });
    } else {
      this.fileManagerService.updateRole(this.selectionData).subscribe(res => {
        this.isDisbled = false;
        if (res && res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.getListData();
          this.isVisible = false;
          this.notificationService.showNotification(Constant.SUCCESS, Constant.MESSAGE_UPDATE_SUCCESS);
        }
      }, error => {

      });
    }
  }
  showModalAdd(): void {
    this.isVisible = true;
    this.selectionData = {
      id: -1, storageInfo: {}
    };
    this.modalTitle = 'Add Role';
  }
  onDeleteClick(id: any): void {
    // alert(id)
    const c = confirm('Are you sure to delete??');
    if (c === true) {
      // Delete workspace here
      this.fileManagerService.deleteRole(id).subscribe(response => {
        // Do some logic and close the popup
        this.getListData();
      }, error => {
        // Error handling and close the popup
        this.selectionData.close();
      });
    }
  }
}
