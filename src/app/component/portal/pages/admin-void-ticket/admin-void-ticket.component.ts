import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { Constant } from 'src/app/shared/constants/constant.class';
import { NotificationService } from 'src/app/service/notification.service';
import { removeAccents } from 'src/app/shared/utils/filters/remove-accents'
import { Workbook } from 'exceljs';
import { DateFormatPipe } from 'src/app/shared/pipe/format-date.pipe';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver-es';

import {
  DxDataGridComponent,
  DxTemplateDirective,
  DxTooltipComponent,
  DxTooltipModule,
} from "devextreme-angular";
@Component({
  selector: 'app-admin-void-ticket',
  templateUrl: './admin-void-ticket.component.html',
  styleUrls: ['./admin-void-ticket.component.scss']
})
export class AdminVoidTicketComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListAccount") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  data: any;
  loading: boolean;
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  titleFormPartner = '';
  constructor(
    private notificationService: NotificationService,
    private generalService: GeneralService,

    private dateFormatPipe: DateFormatPipe,
  ) {
    super('id');
  }
  ngOnInit(): void {
    this.getListData();
  }

  ngOnDestroy(): void {
  }
  getListData() {
    this.loading = true;
    const payload = {
      "page": 1,
      "pageSize": 100
    }
    this.generalService.getAdminVoidTicket(payload).subscribe((res: any) => {
      if (res !== null) {
        this.datas = res.data;
        this.loading = false;
        let stt = 0;
        this.datas.forEach(en => {
          en.stt = ++stt;
        });
        this.filteredDatas = this.datas;
        super.setListOfAllData(this.datas);
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Đã xảy ra lỗi khi tải dữ liệu');
    });
  }

  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }


  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_huy_ve_${dateStr}`;
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
    console.log(keyword);
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.passengerName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.airlineName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.bookingNumber?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.ticketNumber?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.dateCreated?.trim()).toLowerCase().includes(keyword)
    );
  }


}
