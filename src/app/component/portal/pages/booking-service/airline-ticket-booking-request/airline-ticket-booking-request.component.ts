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
  selector: 'airline-ticket-booking-request',
  templateUrl: './airline-ticket-booking-request.component.html',
  styleUrls: ['./airline-ticket-booking-request.component.scss']
})
export class AirlineTicketBookingRequestComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
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
  readonly allowedPageSizes = [5, 10, 15, 20, 'all'];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  isVisibleTicketDetail: boolean = false;
  itemTicketHistoryTicket: any;
  airports: any[] = [];
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
    this.getAirport();
  }

  ngOnDestroy(): void {

  }


  getUserInfo() {
    this.userInfor = JSON.parse(localStorage.getItem(Constant.USER_INFO));
  }
  getAirport() {
    this.generalService.getAirport().subscribe((res: any) => {
      if (res !== null) {
        this.airports = res;
      }
    }, error => {
    });
  }
  getListData() {
    this.loading = true;
    const payload = {
      "page": 1,
      "pageSize": 500
    }
    this.generalService.getAdminHistoryBooking(payload).subscribe((res: any) => {
      if (res !== null) {
        this.datas = res.data;
        this.loading = false;
        let stt = 0;
        this.datas.forEach(en => {
          en.stt = ++stt;
          en.isLoadingViewTicket = false;
        });
        this.filteredDatas = this.datas;
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
      en.startPoint = this.convertRotueBookingReservations(en.route)[stt].startPoint;
      en.endPoint = this.convertRotueBookingReservations(en.route)[stt].endPoint;
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

    return arraybookingDataMap;
  }
  onOpenPopupTicketDetail(booking: any) {
    booking.isLoadingViewTicket = true;
    this.generalService.getBookingByID(booking.bookingId).subscribe({
      next: (res: any) => {
        if (res) {
          this.itemTicketHistoryTicket = res;
          let bookingFlightTotalPrice = 0;
          let i = 0;
          this.itemTicketHistoryTicket.bookingFlights.forEach((bookingFlight: any) => {
            bookingFlightTotalPrice += bookingFlight.totalPrice;
            bookingFlight.startPoint = this.convertRotueBookingReservations(this.itemTicketHistoryTicket.bookingReservations[0].route)[i].startPoint;
            bookingFlight.endPoint = this.convertRotueBookingReservations(this.itemTicketHistoryTicket.bookingReservations[0].route)[i].endPoint;
            i++;
          });
          this.itemTicketHistoryTicket.totalPricebookingFlight = bookingFlightTotalPrice;
        } else {
          this.notificationService.showNotification(Constant.ERROR, `Dữ liệu vé máy bay của khách hàng <strong>${booking.passengerName}</strong> không tồn tại`);
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Dữ liệu vé máy bay trả về đã gặp lỗi');
      },

      complete: () => {
        booking.isLoadingViewTicket = false;
        this.isVisibleTicketDetail = true;
      }
    })
  }


  private convertRotueBookingReservations(route: string): any {
    // Tách chuỗi theo dấu "|"
    const parts = route.trim().split("|");
    // Khởi tạo mảng để lưu kết quả
    const result = [];
    // Lặp qua từng phần tử
    parts.forEach(part => {
      // Sử dụng regex để tìm các cặp từ
      const matches = part.trim().match(/([A-Z]{3})([A-Z]{3})/);
      if (matches && matches.length === 3) {
        // Lấy các match và tạo đối tượng
        const startPoint = matches[1];
        const endPoint = matches[2];
        result.push({ startPoint, endPoint });
      }
    });
    return result;
  }
  toNameAirportByCode(code: String) {
    let mameAirport = '';
    if (code) {
      let airport = this.airports.find((objAirports: any) => objAirports.code === code);
      if (airport) {
        mameAirport = airport.name;
      }
    }
    return mameAirport;
  }
  toAirlineNameByCode(codeAirline: string) {
    switch (codeAirline) {
      case "VN":
        return "Vietnam Airlines";
      case "QH":
        return "Bamboo Airways";
      case "VJ":
        return "VietJet Air";
      default:
        return "";
    }
  }

  handleCancel() {
    this.isVisibleDetailTransactionHistoryTickets = false;
  }

  handleCancelPopup() {
    this.isVisibleTicketDetail = false;

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
    this.filteredDatas = this.datas.filter((en) =>
      removeAccents(en.contactName?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.contactPhone?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.contactEmail?.trim()).toLowerCase().includes(keyword) ||
      removeAccents(en.dateCreated?.trim()).toLowerCase().includes(keyword)
    );
  }

}
