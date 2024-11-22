import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constant } from 'src/app/shared/constants/constant.class';
import { AppConfigService } from 'src/app-config.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Workbook } from 'exceljs';
import { DateFormatPipe } from 'src/app/shared/pipe/format-date.pipe';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';
import { NzImageService } from 'ng-zorro-antd/image';
// import { removeAccents } from ;
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents';
import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from 'devextreme-angular';
import { IsEmptyPipe } from 'src/app/shared/pipe/is-empty.pipe';
import { filter } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { StringUtils } from 'src/app/shared/utils/string-utils.class';
// @ts-ignore
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'utility-room',
  templateUrl: './utility-room.component.html',
  styleUrls: ['./utility-room.component.scss']
})
export class UtilitRoomComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild('ListUtilityRooms') dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  isVisibleUtilityRoom: boolean;
  item: any;
  loading: boolean;
  submitted = false;
  formUtilityRoom: FormGroup;
  filteredDatas: any[] = [];
  searchText = '';
  titleFormUtilityRoom = '';
  isUpdateUtilityRoom: boolean = false;
  constructor(
    private router: Router,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private actionsSubject: ActionsSubject,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe,
    private nzImageService: NzImageService,
    private msg: NzMessageService,
    private dataService: DataService,
  ) {
    super('id');
    this.formUtilityRoom = this.fb.group({
      id: [null],
      type: [null],
      name: [null, [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.getListData();
  }

  ngOnDestroy(): void {

  }

  getListData() {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.generalService.getListUtilityRoom().subscribe(
        {
          next: (res: any) => {
            this.datas = res.data;
            let stt = 0;
            this.datas.forEach((en: any) => {
              en.stt = ++stt;
            });
            this.filteredDatas = this.datas;
            resolve(true);
          },

          error: (error) => {
            this.notificationService.showNotification(Constant.ERROR, 'Dữ liệu tiện ích phòng trả về đã gặp lỗi');
          },

          complete: () => {

          }
        }
      ).add(() => {
        this.loading = false;
      });
    });
  }

  get formControlUtilityRoom() {
    return this.formUtilityRoom.controls;
  }

  showDeleteUtilityRoomConfirm(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn xóa tiện ích phòng này?',
      nzContent: '<b style="color: red;">Tiện ích phòng sẽ không thể hoàn tác sau khi xoá. Ấn đồng ý để xoá</b>',
      nzOkDanger: true,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOnOk: () => this.deleteItemRoomByID(id).then(() => this.getListData()),
    });
  }

  deleteItemRoomByID(id: any) {
    // Delete workspace here
    return new Promise((resolve, reject) => {
      this.generalService.deleteUtilityByID(id).subscribe((res: any) => {
        // Do some logic and close the popup
        if (res && res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, 'Không thể xóa tiện ích phòng');
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Xóa tiện ích phòng thành công');
          resolve(true);
        }
      }, error => {
        // Error handling and close the popup
        this.notificationService.showNotification(Constant.ERROR, 'Đã có lỗi xảy ra khi xoá tiện ích phòng!');
      });
    });
  }

  showModalAddUtilityRoom() {
    this.isVisibleUtilityRoom = true;
    this.submitted = false;
    this.isUpdateUtilityRoom = false
    this.titleFormUtilityRoom = 'Thêm mới tiện ích phòng';
    this.formUtilityRoom.reset();
    this.formUtilityRoom.patchValue({
      id: 0,
      type: 2,
      name: '',
    });

  }

  showModalUpdateUtilityRoom(data: any) {
    this.isVisibleUtilityRoom = true;
    this.submitted = false;
    this.item = data;
    this.titleFormUtilityRoom = 'Sửa thông tin tiện ích phòng';
    this.isUpdateUtilityRoom = true;

    this.formUtilityRoom.patchValue({
      id: this.item.id,
      type: 2,
      name: this.item.name,

    });

  }


  handleCancel() {
    this.isVisibleUtilityRoom = false;
    this.formUtilityRoom.reset();
  }

  saveUtilityRoom() {
    this.submitted = true;
    let formValue = this.formUtilityRoom.value;

    if (this.formUtilityRoom.invalid) {
      this.notificationService.showNotification(Constant.ERROR, 'Tên tiện ích phòng chưa điền!');
      return;
    }

    if (this.isUpdateUtilityRoom === false) {
      /// add
      this.generalService.addUtilityRoom(formValue.name).subscribe((res: any) => {
        if (res) {
          this.notificationService.showNotification(Constant.SUCCESS, `Thêm mới tiện ích phòng thành công`);
          this.isVisibleUtilityRoom = false;
          this.getListData();
        } else {
          this.notificationService.showNotification(Constant.ERROR, `Thêm mới tiện ích phòng thất bại`);
        }
      }, (error: any) => {
        this.notificationService.showNotification(Constant.ERROR, `Thêm mới tiện ích phòng thất bại`);
      });
    } else {
      // / update
      this.generalService.updateUtilityByID(formValue.id, formValue).subscribe((res: any) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, `Cập nhật tiện ích phòng thất bại`);
        } else {
          this.getListData();
          this.isVisibleUtilityRoom = false;
          this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật tiện ích phòng thành công`);
        }
      }, error => {
        this.notificationService.showNotification(Constant.SUCCESS, `Cập nhật tiện ích phòng thất bại`);
      });
    }
  }


  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }


  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_Khach_san_${dateStr}`;
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx');
      });
    });
    e.cancel = true;
  }

  onSearch() {
    const keyword = removeAccents(this.searchText.trim().toLowerCase());
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.name?.toString().trim()).toLowerCase().includes(keyword)
    );
  }

}
