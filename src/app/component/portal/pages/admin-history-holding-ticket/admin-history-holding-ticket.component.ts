import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/service/general-service';
import { TableSelectionAbstract } from 'src/app/shared/component/table/table-selection.abstract';
import { Constant } from 'src/app/shared/constants/constant.class';
import { AppConfigService } from 'src/app-config.service';
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
  selector: 'app-admin-history-holding-ticket',
  templateUrl: './admin-history-holding-ticket.component.html',
  styleUrls: ['./admin-history-holding-ticket.component.scss']
})
export class AdminHistoryHoldingTicketComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListAccount") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  data: any;
  item: any;
  loading: boolean;
  filteredDatas: any[] = [];
  searchText = '';
  userInfor: any;
  titleFormPartner = '';
  isVisibleDetailTransactionHistoryTickets: boolean = false;
  listDetailTicket: any[];
  readonly allowedPageSizes = [5, 10, 'all'];
  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  constructor(
    public translate: TranslateService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private configService: AppConfigService,
    private dateFormatPipe: DateFormatPipe,
  ) {
    super('id');


  }

  ngOnInit(): void {
    this.getListData();
    this.getUserInfo();
  }

  ngOnDestroy(): void {

  }


  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
    console.log('this.userInfor: ', this.userInfor);
  }

  getListData() {
    this.loading = true;
    const payload = {
      "page": 1,
      "pageSize": 100
    }
    this.generalService.getAdminHistoryBooking(payload).subscribe((res: any) => {
      if (res !== null) {
        this.datas = res.data;
        this.loading = false;
        let stt = 0;
        this.datas.forEach(en => {
          en.stt = ++stt;
        });
        this.filteredDatas = this.datas;
        // console.log(this.datas);
        super.setListOfAllData(this.datas);
      }
    }, error => {
      this.notificationService.showNotification(Constant.ERROR, 'Đã xảy ra lỗi khi tải dữ liệu');
    });
  }


  previewDetailTransactionHistoryTickets(historyTransaction: any) {
    this.isVisibleDetailTransactionHistoryTickets = true;
    this.listDetailTicket = this.getListDetailTicket(historyTransaction);
    let stt = 0;
    this.listDetailTicket.forEach(en => {
      en.gender = en.gender ? 'Nam' : 'Nữ'
      en.fromToPoint = `${en.startPoint} - ${en.endPoint}`
      en.stt = ++stt;
    });
  }

  getListDetailTicket(historyTransaction: any) {
    const bookingFlights = historyTransaction.bookingFlights;
    const bookingPassengers = historyTransaction.bookingPassengers;
    const bookingReservations = historyTransaction.bookingReservations;

    // Create a dictionary to store objects based on bookingId
    let arraybookingDataMap = [];

    // Populate the dictionary with data from bookingFlights
    bookingFlights.forEach((flight: any) => {
      let bookingDataMap = {};
      if (flight) {
        bookingDataMap = { ...flight };
      }
      const bookingId = flight.bookingId;

      const matchingPassenger = bookingPassengers.find((passenger: any) => passenger.bookingId = flight.bookingId);
      if (matchingPassenger) {
        bookingDataMap = { ...bookingDataMap, ...matchingPassenger };
      }

      const matchingReservation = bookingReservations.find((reservation: any) => reservation.bookingId === flight.bookingId);
      if (matchingReservation) {
        bookingDataMap = { ...bookingDataMap, ...matchingReservation };
      }

      arraybookingDataMap.push(bookingDataMap);
    });

    console.log(arraybookingDataMap);
    return arraybookingDataMap;
  }

  handleCancel() {
    this.isVisibleDetailTransactionHistoryTickets = false;
  }

  exportData() {
    this.dataGridDetail.instance.exportToExcel(false);
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const from = this.dateFormatPipe.transformFull(new Date(), Constant.DATE_FMT_STR);
    const dateStr = from;
    const fileName = `DS_Giu_ve_${dateStr}`;
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
      removeAccents(en.contactName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.contactPhone?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.contactEmail?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.dateCreated?.trim()).toLowerCase().includes(keyword)
    );
  }

}
