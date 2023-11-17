import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
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
  selector: 'app-admin-ticket',
  templateUrl: './admin-ticket.component.html',
  styleUrls: ['./admin-ticket.component.scss']
})
export class AdminTicketComponent extends TableSelectionAbstract implements OnInit, OnDestroy {
  @ViewChild("ListAccount") dataGridDetail: DxDataGridComponent;
  datas: any[] = [];
  airports: any[] = [];
  bookingTicketDetail: any = {};
  data: any;
  loading: boolean;
  loadingSystemStatus: boolean = false;
  filteredDatas: any[] = [];
  searchText = '';
  isVisibleTicketDetail: boolean = false;

  constructor(
    public translate: TranslateService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private dateFormatPipe: DateFormatPipe,
    private modalService: NzModalService,
  ) {
    super('id');
  }

  ngOnInit(): void {
    this.getListData();
    this.getAirport();
  }

  ngOnDestroy(): void {

  }


  getListData() {
    this.loading = true;
    const payload = {
      "page": 1,
      "pageSize": 100
    }
    this.generalService.getAdminTicket(payload).subscribe(
      (res: any) => {
        if (res !== null) {
          this.datas = res.data;
          this.loading = false;
          let stt = 0;
          this.datas.forEach(en => {
            en.stt = ++stt;
            en.isLoadingViewTicket = false;
          });
          this.filteredDatas = this.datas;
          // console.log(this.datas);
          super.setListOfAllData(this.datas);
        }
      },
      (error: any) => {
        this.notificationService.showNotification(Constant.ERROR, 'Đã xảy ra lỗi khi tải dữ liệu');
      }

    );
  }

  getAirport() {
    this.generalService.getAirport().subscribe((res: any) => {
      if (res !== null) {
        this.airports = res;
      }
    }, error => {
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
    const fileName = `DS_xuat_ve_${dateStr}`;
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

  onOpenPopupTicketDetail(booking: any) {
    booking.isLoadingViewTicket = true;
    this.generalService.getBookingByID(booking.bookingId).subscribe({
      next: (res: any) => {
        if (res) {
          this.bookingTicketDetail = res;

          let bookingFlightTotalPrice = 0;
          let i = 0;
          this.bookingTicketDetail.bookingFlights.forEach((bookingFlight: any) => {
            bookingFlightTotalPrice += bookingFlight.totalPrice;
            bookingFlight.startPoint = this.convertRotueBookingReservations(this.bookingTicketDetail.bookingReservations[0].route)[i].startPoint;
            bookingFlight.endPoint = this.convertRotueBookingReservations(this.bookingTicketDetail.bookingReservations[0].route)[i].endPoint;
            i++;
          });
          this.bookingTicketDetail.totalPricebookingFlight = bookingFlightTotalPrice;

          console.log('this.bookingTicketDetail.bookingFlights: ', this.bookingTicketDetail.bookingFlights);

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



  handleCancelPopup() {
    this.isVisibleTicketDetail = false;
  }


  onChangeStatusSystemTicketExport(ticketFlightExp: any) {
    if (!ticketFlightExp.systemCancelled) {
      this.modalService.confirm({
        nzTitle: `Bạn có chắc KHÔNG tính chi phí vé máy bay của khách hàng <strong>${ticketFlightExp.passengerName}</strong> vào công nợ`,
        nzContent: `<b style="color: red;">Việc KHÔNG tính chi phí vé máy bay của khách hàng <strong>${ticketFlightExp.passengerName} vào công nợ sẽ không thể hoàn tác. Ấn đồng ý để tiếp tục</b>`,
        nzOkDanger: true,
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOnOk: () => this.changeSystemStatusTicketExport(ticketFlightExp.bookingId),
      });
    }
  }

  changeSystemStatusTicketExport(idBookingTicketFlightExp: any) {
    this.generalService.markCanceledSystemTicketFlightExport(idBookingTicketFlightExp).subscribe({
      next: (res) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.notificationService.showNotification(Constant.SUCCESS, 'Thiết lập không tính công nợ thành công');
        }
      },

      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Thiết lập không tính công nợ không thành công');
      },

      complete: () => {
        this.getListData();
      }
    });
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
}





