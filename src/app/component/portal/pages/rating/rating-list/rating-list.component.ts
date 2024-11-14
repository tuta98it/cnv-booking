import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NotificationService} from '../../../../../service/notification.service';
import {GeneralService} from '../../../../../service/general-service';
import {AppConfigService} from '../../../../../../app-config.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {DateFormatPipe} from '../../../../../shared/pipe/format-date.pipe';
import {TableSelectionAbstract} from '../../../../../shared/component/table/table-selection.abstract';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.scss']
})
export class RatingListComponent extends TableSelectionAbstract implements OnInit {
  datas = [];
  pageSize: any;
  page: any;
  defaultPage: any;
  dataSource: any;
  isShowPopupDetail: boolean;
  dataItem: any;
  constructor(public translate: TranslateService,
              private modalService: NzModalService,
              private notificationService: NotificationService,
              private generalService: GeneralService,
              private configService: AppConfigService,
              private fb: FormBuilder,
              private router: Router,
              private dateFormatPipe: DateFormatPipe) {
    super('id');
    this.dataItem = {};
  }

  ngOnInit(): void {
    this.pageSize = this.configService.getConfig().pageSize;
    this.page = this.configService.getConfig().page;
    this.defaultPage = this.configService.getConfig().defaultPage;
    this.initTableHeight(1200);
    this.loadGrid();
  }

  getRowIndex(rowData: any, rowIndex: number): number {
    return rowData.name;  // Hiển thị STT bắt đầu từ 1
  }

  onCellPrepared(e: any) {
    if (e.rowType === 'data' && e.column.caption === 'STT') {
      e.cellElement.innerText = e.rowIndex + 1; // Hiển thị index từ 1
    }
  }

  loadGrid() {
    const payload = {
      page: 1,
      pageSize: 1000
    };
    this.generalService.getListRating(payload).subscribe(res => {
      let index = 1;
      res.details.forEach(en => {
        en.stt = index++;
      });
      this.datas = res.details;
    });
  }
  toArray(size) {
    return Array.from({ length: size }, (_, i) => i + 1);
  }
  showModalView(data: any) {
    console.log(data);
    this.isShowPopupDetail = true;
    this.dataItem =  data;
  }

  handleCancel() {
    this.isShowPopupDetail = false;
  }
}
