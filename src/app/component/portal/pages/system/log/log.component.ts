import {Component, OnInit, ViewChild} from '@angular/core';
import {TableSelectionAbstract} from '../../../../../shared/component/table/table-selection.abstract';
import {DxDataGridComponent} from 'devextreme-angular';
import {FileManagerService} from '../../../../../service/file-manager.service';
import {NotificationService} from '../../../../../service/notification.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Constant} from '../../../../../shared/constants/constant.class';
import {Workbook} from 'exceljs';
import {exportDataGrid} from 'devextreme/excel_exporter';
import {saveAs} from 'file-saver-es';
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent extends TableSelectionAbstract implements OnInit {
  bucketId: any;
  size = 'small';
  loading: boolean;
  datas: any[];
  selectionData: any;
  isVisible = false;
  isDisbled: boolean;
  rate: number;
  color = '#08C';
  modalTitle = 'Cập nhật danh mục thiết bị';
  switchValue = false;
  /*PERMISSION*/
  userInfo: any;
  ADD_LABEL: boolean;
  EDIT_LABEL: boolean;
  DELETE_LABEL: boolean;
  filter: any;
  status: any;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  constructor(
    private fileManagerService: FileManagerService,
    private notificationService: NotificationService,
    private sanitized: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super('id');
    this.filter = {};
  }

  ngOnInit(): void {
    this.status = this.route.snapshot.paramMap.get('status');
    this.userInfo = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    if (this.userInfo) {
      this.ADD_LABEL = true;
      this.EDIT_LABEL = true;
      this.DELETE_LABEL = true;
    }
    this.initTableHeight(1200);
    if (!this.status) {
      this.getListData();
    }
  }
  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const fileName = `Lich_su_he_thong`;
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], {type: 'application/octet-stream'}), fileName + '.xlsx');
      });
    });
    e.cancel = true;
  }
  checkPermission(per: number): boolean {
    return this.fileManagerService.checkPermission(this.userInfo.roleIds, per);
  }
  getListData() {
    this.loading = true;
    const payload = {
      page: 1,
      pageSize: 10000,
    };
    this.fileManagerService.getLog(payload).subscribe(res => {
      if (res !== null) {
        this.datas = res.data;
        this.loading = false;
      }
    }, error => {

    });
  }

  doSearch() {
    this.getListData();
  }
  exportData() {
    this.dataGrid.instance.exportToExcel(false);
  }
}
