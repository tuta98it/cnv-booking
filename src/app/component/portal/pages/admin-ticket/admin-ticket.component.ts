import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
} from "devextreme-angular";
import { UploadService } from 'src/app/service/upload-service';
import { CheckValidatorForm } from 'src/app/shared/custom-validator/checkValidatorForm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attachment } from 'src/app/model/attachment';
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
  nzVisibleCancelSystem: boolean = false;
  isVisibleViewInVoice: boolean = false;
  systemCancelBookingFligh = {
    submitted: false,
    nodeSystemCancelled: '',
  }
  item: any;
  readonly allowedPageSizes = [20, 50, 100, 200, 500 ,'all'];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;

  orderForm: FormGroup;

  constructor(
    public translate: TranslateService,
    private notificationService: NotificationService,
    private generalService: GeneralService,
    private dateFormatPipe: DateFormatPipe,
    private modalService: NzModalService,
    private uploadService: UploadService,
    private fb: FormBuilder
  ) {
    super('id');
    this.orderForm = fb.group({
      pdfFile: [null, Validators.required],
      xmlFile: [null, Validators.required]
    });
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
      "pageSize": 500
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

  handleCancelConfirmCancelSystem() {
    this.nzVisibleCancelSystem = false;
    this.resetConfirmSystemCancel();
  }

  private resetConfirmSystemCancel() {
    this.systemCancelBookingFligh.nodeSystemCancelled = '';
    this.systemCancelBookingFligh.submitted = false;
  }

  onChangeStatusSystemTicketExport(ticketFlightExp: any) {
    this.nzVisibleCancelSystem = true;
    this.resetConfirmSystemCancel();
    this.item = ticketFlightExp;
    // if (!ticketFlightExp.systemCancelled) {
    //   this.modalService.confirm({
    //     nzTitle: `Bạn có chắc KHÔNG tính chi phí vé máy bay của khách hàng <strong>${ticketFlightExp.passengerName}</strong> vào công nợ`,
    //     nzContent: `<b style="color: red;">Việc KHÔNG tính chi phí vé máy bay của khách hàng <strong>${ticketFlightExp.passengerName} vào công nợ sẽ không thể hoàn tác. Ấn đồng ý để tiếp tục</b>`,
    //     nzOkDanger: true,
    //     nzOkText: 'Đồng ý',
    //     nzCancelText: 'Không',
    //     nzOnOk: () => this.changeSystemStatusTicketExport(ticketFlightExp.bookingId),
    //   });
    // }
  }

  changeSystemStatusTicketExport(idBookingTicketFlightExp: any, noteSystemCancelled: any) {
    this.systemCancelBookingFligh.submitted = true;
    if (!noteSystemCancelled) {
      this.notificationService.showNotification(Constant.ERROR, 'Nội dung ghi chú không được để trống');
      return;
    }
    let payload = { noteSystemCancelled: noteSystemCancelled };
    this.generalService.markCanceledSystemTicketFlightExport(idBookingTicketFlightExp, payload).subscribe({
      next: (res) => {
        if (res.ret && res.ret[0].code !== 0) {
          this.notificationService.showNotification(Constant.ERROR, res.ret[0].message);
        } else {
          this.handleCancelConfirmCancelSystem();
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
  //#region hóa đơn
  @ViewChild('fileInputOrderPdf', { static: false }) orderPdfFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputOrderXml', { static: false }) orderXmlFileInput!: ElementRef<HTMLInputElement>;
  selectedOrderPdfFile: Attachment = { name: '', path: '', file: null };
  selectedOrderXmlFile: Attachment = { name: '', path: '', file: null };

  closeViewInVoice(){
    // let valid = CheckValidatorForm(this.orderForm);
    // if (!valid) {
    //   this.notificationService.showNotification(Constant.ERROR, "Vui lòng nhập đầy đủ thông tin");
    //   return;
    // }
    this.isVisibleViewInVoice = false;
  }
  showDialogSelectOrderPdfFile() {
    this.orderPdfFileInput.nativeElement.click();
  }
  showDialogSelectOrderXmlFile() {
    this.orderXmlFileInput.nativeElement.click();
  }
  onOrderPdfFileSelected(event: any): void { // đã chọn file đính kèm
    const input = event.target as HTMLInputElement; // trỏ đến thẻ input chứa file
    if (input.files && input.files.length > 0) { // input có chứa file
      let file = input.files[0]; // lấy ra file
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // lấy ra đuôi của file
      if (fileExtension === 'pdf') {
        this.orderForm.controls['pdfFile'].setValue(file.name);
        this.selectedOrderPdfFile.file = file;
        this.selectedOrderPdfFile.name = file.name;
        this.selectedOrderPdfFile.path = null;
      } else {
        // this.orderForm.controls['pdfFile'].reset();
        this.selectedOrderPdfFile = { name: '', path: '', file: null };
        this.notificationService.showNotification(Constant.ERROR, 'Chỉ nhận file pdf');
      }
    }
  }
  onOrderXmlFileSelected(event: any): void { // đã chọn file đính kèm
    const input = event.target as HTMLInputElement; // trỏ đến thẻ input chứa file
    if (input.files && input.files.length > 0) { // input có chứa file
      let file = input.files[0]; // lấy ra file
      const fileExtension = file.name.split('.').pop()?.toLowerCase(); // lấy ra đuôi của file
      if (fileExtension === 'xml') {
        this.orderForm.controls['xmlFile'].setValue(file.name);
        this.selectedOrderXmlFile.file = file;
        this.selectedOrderXmlFile.name = file.name;
        this.selectedOrderXmlFile.path = null;
      } else {
        // this.orderForm.controls['xmlFile'].reset();
        this.selectedOrderXmlFile = { name: '', path: '', file: null };
        this.notificationService.showNotification(Constant.ERROR, 'Chỉ nhận file xml');
      }
    }
  }
  viewOrderFilePdf() {
    window.open(this.uploadService.getFile(this.item.pdfFile), '_blank');
  }
  viewOrderFileXml() {
    window.open(this.uploadService.getFile(this.item.xmlFile), '_blank');
  }
  async uploadOrderFile() {
    let valid = CheckValidatorForm(this.orderForm);
    if (!valid) {
      this.notificationService.showNotification(Constant.ERROR, "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    let waitUpload = [];
    if(this.selectedOrderPdfFile.file){
      let formDataPdf = new FormData();
      formDataPdf.append("postedFile", this.selectedOrderPdfFile.file);
      formDataPdf.append("OrderTicketId", this.item.id);
      waitUpload.push(this.uploadOrderPdf(formDataPdf));
    }
    if(this.selectedOrderXmlFile.file){
      let formDataXml = new FormData();
      formDataXml.append("postedFile", this.selectedOrderXmlFile.file);
      formDataXml.append("OrderTicketId", this.item.id);
      waitUpload.push(this.uploadOrderXml(formDataXml));
    }
    await Promise.all(waitUpload).then((rev)=>{
      this.getListData();
      this.isVisibleViewInVoice = false;
    })

  }
  uploadOrderPdf(formDataPdf): Promise<any> {
    return new Promise((rev, rej) => {
      this.uploadService.uploadOrderTicketPdfFile(formDataPdf).subscribe({
        next: (res) => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Tải hóa đơn thành công');
          rev(res.path);
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Tải hóa đơn không thành công');
          rej({});
        }
      });
    })
  }
  uploadOrderXml(formDataXml): Promise<any> {
    return new Promise((rev, rej) => {
      this.uploadService.uploadOrderTicketXmlFile(formDataXml).subscribe({
        next: (res) => {
          this.notificationService.showNotification(Constant.SUCCESS, 'Tải hóa đơn thành công');
          rev(res.path);
        },
        error: (error) => {
          this.notificationService.showNotification(Constant.ERROR, 'Tải hóa đơn không thành công');
          rej({});
        }
      });
    })
  }
  deleteOrderPdfFile() {
    this.uploadService.removeOrderTicketPdfFile(this.item.id).subscribe({
      next: (res) => {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa hóa đơn thành công');
        this.orderForm.clearValidators();
        this.orderPdfFileInput.nativeElement.value = null;
        this.orderForm.controls['pdfFile'].setValue(null);
        this.selectedOrderPdfFile = { name: '', path: '', file: null };
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Xóa hóa đơn không thành công');
      },
      complete: () => {
        this.getListData();
      }
    });
  }
  deleteOrderXmlFile() {
    this.uploadService.removeOrderTicketXmlFile(this.item.id).subscribe({
      next: (res) => {
        this.notificationService.showNotification(Constant.SUCCESS, 'Xóa hóa đơn thành công');
        this.orderXmlFileInput.nativeElement.value = null;
        this.orderForm.controls['xmlFile'].setValue(null);
        this.selectedOrderXmlFile = { name: '', path: '', file: null };
      },
      error: (error) => {
        this.notificationService.showNotification(Constant.ERROR, 'Xóa hóa đơn không thành công');
      },
      complete: () => {
        this.getListData();
      }
    });
  }
  onOpenViewInVoice(data: any) {
    this.item = data;
    this.isVisibleViewInVoice = true;
    this.orderForm.reset();
    if (this.item.pdfFile) {
      this.selectedOrderPdfFile = { name: this.item.pdfFile.split('/').pop(), path: this.item.pdfFile, file: null };
      this.orderForm.controls["pdfFile"].setValue(this.item.pdfFile.split('/').pop());
    }
    else {
      this.orderForm.controls["pdfFile"].setValue(null);
    }
    if (this.item.xmlFile) {
      this.selectedOrderXmlFile = { name: this.item.xmlFile.split('/').pop(), path: this.item.xmlFile, file: null };
      this.orderForm.controls["xmlFile"].setValue(this.item.xmlFile.split('/').pop());
    }
    else {
      this.orderForm.controls["xmlFile"].setValue(null);
    }
  }
  //#endregion
}





